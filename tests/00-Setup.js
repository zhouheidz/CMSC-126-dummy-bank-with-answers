const assert = require('chai').assert;

describe('Initial Setup must install the following dependencies:', function() {
    const dependencies = require('../package.json').dependencies;

    it('"express", the web framework based on nodejs', function() {
        assert.property(dependencies, 'express');
        assert.doesNotThrow(() => require('express'));
    });

    it('"body-parser", for parsing http request bodies', function() {
        assert.property(dependencies, 'body-parser');
        assert.doesNotThrow(() => require('body-parser'));
    });

    it('"nunjucks", for rendering templates', function() {
        assert.property(dependencies, 'nunjucks');
        assert.doesNotThrow(() => require('nunjucks'));
    });

    it('"consolidate", to make nunjucks conpatible with express', function() {
        assert.property(dependencies, 'consolidate');
        assert.doesNotThrow(() => require('consolidate'));
    });
    it('"cookie-parser", for parsing cookies in the header', function() {
        assert.property(dependencies, 'cookie-parser');
        assert.doesNotThrow(() => require('cookie-parser'));
    });  
    it('"mocha", testing framework for Node.js', function() {
        assert.property(dependencies, 'mocha');
        assert.doesNotThrow(() => require('mocha'));
    }); 
    it('"chai", for asserting values against expected outputs', function() {
        assert.property(dependencies, 'chai');
        assert.doesNotThrow(() => require('chai'));
    });  
    it('"axios", to simplify HTTP requests', function() {
        assert.property(dependencies, 'axios');
        assert.doesNotThrow(() => require('axios'));
    });          
    it('"sinon", for writing JavaScript unit tests', function() {
        assert.property(dependencies, 'sinon');
        assert.doesNotThrow(() => require('sinon'));
    });  
    it('"stubs", to avoid writing the same code again and again', function() {
        assert.property(dependencies, 'stubs');
        assert.doesNotThrow(() => require('stubs'));
    });   
    it('"passport", for simplifying authentication requests', function() {
        assert.property(dependencies, 'passport');
        assert.doesNotThrow(() => require('passport'));
    });   

    it('"pg", provides access to PostgreSQL commands', function() {
        assert.property(dependencies, 'pg');
        assert.doesNotThrow(() => require('pg'));
    });   

    it('"sequelize", an ORM tool for Node.js', function() {
        assert.property(dependencies, 'sequelize');
        assert.doesNotThrow(() => require('sequelize'));
    });   
                             
});