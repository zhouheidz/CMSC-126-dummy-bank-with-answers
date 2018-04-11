const path = require('path');
const assert = require('chai').assert;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Web Server', function() {
    beforeEach(function() {
        const express = require('express');
        const app = express();
        const methods = {
            set: app.set.bind(app),
            use: app.use.bind(app),
            engine: app.engine.bind(app),
            listen: app.listen.bind(app)
        };

        this.spies = {};

        const test = this;
        for (let method in methods) {
            this.spies[method] = sinon.spy();
            app[method] = function() {
                test.spies[method].call(test.spies[method], ...arguments);
                return methods[method].call(methods[method], ...arguments);
            };
        }

        this.staticStub = sinon.stub().returns(express.static('./static'));
        this.originalStatic = express.static;
        express.static = this.staticStub;

        this.stubs = { express: sinon.stub().returns(app) };
    });

    it('setup should be written inside a file named "index" \n', function() {
        assert.doesNotThrow(() => require('../index'));
    });

    it('views should be from the "views" directory', function() {
        proxyquire('../index', this.stubs);
        assert.doesNotThrow(() => require('../index'));
        assert.isTrue(this.spies.set.called);
        assert.isTrue(this.spies.set.calledWith('views', sinon.match((value) => {
            return /^(\.\/)?views\/?$/.test(value)
                || value === path.join(__dirname, '..', 'views');
        })));
    });

    it('static files should be from the "static" directory', function() {
        proxyquire('../index', this.stubs);
        assert.doesNotThrow(() => require('../index'));
        assert.isTrue(this.spies.use.called);
        assert.isTrue(this.spies.use.calledWith('/static', sinon.match((value) => {
            return value.toString() === this.originalStatic(path.join(__dirname, '..', 'static')).toString();
        })));
        assert.isTrue(this.staticStub.called);
        assert.isTrue(this.staticStub.calledWith(sinon.match((value) => {
            return /^(\.\/)?static\/?$/.test(value)
                || value === path.join(__dirname, '..', 'static');
        })));
    });

});
