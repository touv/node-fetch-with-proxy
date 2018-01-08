const assert = require('assert');
const fetch = require('../lib/index.js').default;

describe('try fetch', () => {
    it('http url', (done) => {
        const url = 'http://data.bnf.fr';
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

    it('http url with path', (done) => {
        const url = 'http://www.cnrs.fr/fr/recherche/index.htm';
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
    })
});
