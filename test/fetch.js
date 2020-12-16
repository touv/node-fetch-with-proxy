const http = require('http');
const assert = require('assert');
const AbortController = require('node-abort-controller');
const fetch = require('../lib/index.js').default;

describe('try fetch', function () {
    this.timeout(7000);
    it('http url', (done) => {
        const server = http.createServer(function(req, res) {
            res.writeHead(200);
            res.end('Salut tout le monde !');
        });
        server.listen(55555);
        const url = 'http://127.0.0.1:55555';
        fetch(url)
            .then(function (response) {
                return response.status;
            })
            .then((code) => {
                assert.equal(code, 200);
                server.close();
                done();
            })
            .catch(done);
    });

    it('http url (timeout)', (done) => {
        const server = http.createServer(function(req, res) {
            setTimeout(() => { 
                res.writeHead(200);
                res.end('Salut tout le monde !');
            }, 6000);
        });
        server.listen(44444);
        const url = 'http://127.0.0.1:44444';
        fetch(url,  { timeout:1000, agent:false })
            .then(function (response) {
                return response.status;
            })
            .then((code) => {
                done(new Error('For this test, error is right behaviour'));
            })
            .catch(() => { 
                server.close();
                done();
            });
    });

    it('https url', (done) => {
        const url = 'https://www.google.fr/';
        fetch(url)
            .then(function (response) {
                return response.status;
            })
            .then((code) => {
                assert.equal(code, 200);
                done();
            })
            .catch(done);
    });


    it('https unknown port', (done) => {
        const url = 'http://127.0.0.1:11111';
        fetch(url)
            .then(function (response) {
                return response.status;
            })
            .then((code) => {
                done(new Error('For this test, error is right behaviour'));
            })
            .catch(() => done());
    });


    it('https unknown url', (done) => {
        const url = 'http://aaa.bbb.cc';
        fetch(url)
            .then(function (response) {
                return response.status;
            })
            .then((code) => {
                done(new Error('For this test, error is right behaviour'));
            })
            .catch(() => done());
    });


    it('https url with path', (done) => {
        const url = 'https://nodejs.org/api/http.html';
        fetch(url)
            .then(function (response) {
                return response.status;
            })
            .then((code) => {
                assert.equal(code, 200);
                done();
            })
            .catch(done);
    });

    it('https url and abort', (done) => {
        const url = 'https://nodejs.org/api/http.html';

        const controller = new AbortController()
        const signal = controller.signal;

        fetch(url, { signal })
            .then(function (response) {
                return response.status;
            })
            .then((code) => {
                done(new Error('For this test, error is right behaviour'));
            })
            .catch(() => done());
        setTimeout(() => controller.abort(), 1)
    });

    it('https url with path & NO_PROXY', (done) => {
        process.env.HTTPS_PROXY = 'exemple.com:8080';
        process.env.NO_PROXY = 'nodejs.org';

        const url = 'https://nodejs.org/api/http.html';
        fetch(url)
            .then(function (response) {
                return response.status;
            })
            .then((code) => {
                assert.equal(code, 200);
                done();
            })
            .catch(done);
    })

});
