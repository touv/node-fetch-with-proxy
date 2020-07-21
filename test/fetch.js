const http = require('http');
const assert = require('assert');
const fetch = require('../lib/index.js').default;

describe('try fetch', () => {
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
