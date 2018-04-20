describe('Initial Setup must install the following dependencies:', function() {
    const dependencies = Object.keys(require('../package.json').dependencies);

    it('"express", the web framework based on nodejs', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['express']));
    });

    it('"body-parser", for parsing http request bodies', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['body-parser'])); 
    });

    it('"nunjucks", for rendering templates', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['nunjucks']));
    });

    it('"consolidate", to make nunjucks conpatible with express', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['consolidate']));
    });
    it('"cookie-parser", for parsing cookies in the header', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['cookie-parser']));
    });  
    it('"mocha", testing framework for Node.js', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['mocha']));
    }); 
    it('"chai", for asserting values against expected outputs', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['chai']));
    });  
    it('"axios", to simplify HTTP requests', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['axios']));
    });          
    it('"sinon", for writing JavaScript unit tests', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['sinon']));
    });  
    it('"stubs", to avoid writing the same code again and again', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['stubs']));
    });   
    it('"passport", for simplifying authentication requests', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['passport']));
    });   

    it('"pg", provides access to PostgreSQL commands', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['pg']));
    });   

    it('"sequelize", an ORM tool for Node.js', function() {
        expect(dependencies).toEqual(jasmine.arrayContaining(['sequelize']));
    });   
                             
});