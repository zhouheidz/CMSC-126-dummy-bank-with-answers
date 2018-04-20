const assert = require('chai').assert;
const axios = require('axios');
const cheerio = require('cheerio');

describe('Web Routes and Function tests', function() {
    describe('route: /', function() {
        beforeEach(function() {
            this.url = 'http://localhost:3000';
        });

        it('should handle GET requests and respond with 200 OK status code', async function() {
            const response = await axios.get(this.url);
            assert.equal(response.status, 200);
        });

        it('should render login page', async function() {
            const response = await axios.get(this.url);
            const $ = cheerio.load(response.data);
            assert.equal($('body#login-page').length, 1);
        });
    });
});