const expect = require('chai').expect;
const Container = require('./container.class.js');

describe('container class', () => {
    it('should create a correct instance', () => {
        const config = {name: 'thisisarandomname', path: '/test/path/to/container/', start_command: 'node app.js', depends: ['a', 'b', 'c']}
        var container = new Container(config);
        expect(container.name).to.equal(config.name);
        expect(container.path).to.equal(config.path);
        expect(container.start_command).to.equal(config.start_command);
        expect(container.depends).to.equal(config.depends);
        //default values
        expect(container.version).to.equal('1.0'); 
        expect(container.autostart).to.equal(false);
    })

    it('should throw an "invalid config"-error', () => {
        expect(() => new Container()).to.throw('invalid config');
        expect(() => new Container(123)).to.throw('invalid config');
        expect(() => new Container('hello there')).to.throw('invalid config');
    })

    it('should throw an "incomplete config"-error', () => {
        const ERROR_MSG = 'incomplete config';
        expect(() => new Container({})).to.throw(ERROR_MSG);
        expect(() => new Container({name: 'test_container'})).to.throw(ERROR_MSG);
        expect(() => new Container({start_command: 'test_command'})).to.throw(ERROR_MSG);
        expect(() => new Container({path: '/test/path/to/container/'})).to.throw(ERROR_MSG);
        expect(() => new Container({name: 'test_container', start_command: 'test_command'})).to.throw(ERROR_MSG);
        expect(() => new Container({name: 'test_container', path: '/test/path/to/container/'})).to.throw(ERROR_MSG);
        expect(() => new Container({start_command: 'test_command', path: '/test/path/to/container/'})).to.throw(ERROR_MSG);
    })
})