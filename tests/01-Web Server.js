const path = require('path');
const assert = require('chai').assert;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Web Server', function() {

    it('setup should be written inside a file named "index" \n', function() {
    	expect(require('../index.js')).not.toThrow();
        // assert.doesNotThrow(() => require('../index'));
    });
});