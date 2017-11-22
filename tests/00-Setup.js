const assert = require('chai').assert;

describe('Initial Setup must install the following dependencies:', function() {
    const dependencies = require('../package.json').dependencies;

    it('"express"', function() {
        assert.property(dependencies, 'express');
        assert.doesNotThrow(() => require('express'));
    });

    it('"body-parser"', function() {
        assert.property(dependencies, 'body-parser');
        assert.doesNotThrow(() => require('body-parser'));
    });

    it('"nunjucks"', function() {
        assert.property(dependencies, 'nunjucks');
        assert.doesNotThrow(() => require('nunjucks'));
    });

    it('"consolidate"', function() {
        assert.property(dependencies, 'consolidate');
        assert.doesNotThrow(() => require('consolidate'));
    });
    it('"cookie-parser"', function() {
        assert.property(dependencies, 'cookie-parser');
        assert.doesNotThrow(() => require('cookie-parser'));
    });  
    it('"mocha"', function() {
        assert.property(dependencies, 'mocha');
        assert.doesNotThrow(() => require('mocha'));
    }); 
    it('"chai"', function() {
        assert.property(dependencies, 'chai');
        assert.doesNotThrow(() => require('chai'));
    });  
    it('"axios"', function() {
        assert.property(dependencies, 'axios');
        assert.doesNotThrow(() => require('axios'));
    });          
    it('"sinon"', function() {
        assert.property(dependencies, 'sinon');
        assert.doesNotThrow(() => require('sinon'));
    });  
    it('"stubs"', function() {
        assert.property(dependencies, 'stubs');
        assert.doesNotThrow(() => require('stubs'));
    });   
    it('"passport"', function() {
        assert.property(dependencies, 'passport');
        assert.doesNotThrow(() => require('passport'));
    });   

    it('"pg"', function() {
        assert.property(dependencies, 'pg');
        assert.doesNotThrow(() => require('pg'));
    });   

    it('"sequelize"', function() {
        assert.property(dependencies, 'sequelize');
        assert.doesNotThrow(() => require('sequelize'));
    });   
                             
});