const assert = require('chai').assert;
const axios = require('axios');
const cheerio = require('cheerio');

describe('Web Server Test:', function() { 
    describe('Server Running:', function() {
        beforeEach(function() {
            this.url = 'http://localhost:3000';
        });

        it('Server must be running:', async function() {
            const response = await axios.get(this.url);
            assert.equal(response.status, 200);

        }); 
        describe('route: /', function() {
            beforeEach(function() {
                this.url = 'http://localhost:3000';
            });

            it('must respond with 200 OK status code', async function() {
                const response = await axios.get(this.url);
                assert.equal(response.status, 200, "Check the route");
            });
        });

        describe('route: /profile', function() {
            beforeEach(function() {
                this.url = 'http://localhost:3000/profile'
            });

            it('must respond with 200 OK status code', async function() {
                const response = await axios.get(this.url);
                assert.equal(response.status, 200);
            });
        });              
    });
});