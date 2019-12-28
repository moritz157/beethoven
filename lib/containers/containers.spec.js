const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const Container = require('./container.class.js');
const { BeethovenFileNotFoundError, ContainerAlreadyExistsError } = require('../utils/errors.js');

var fsMock = {}
var containers = proxyquire('./containers.js', {'fs': fsMock});

mockContainersJson = `["/link/to/your/container/directory/"]`;
fsMock.readFileSync = (path) => {
    if(path=='./containers.json') {
        return mockContainersJson;
    } else if(path=='/link/to/your/container/directory/beethoven.json') {
        return `{
            "name": "test",
            "version": "1.0",
            "start_command": "node",
            "start_arguments": ["app.js"],
            "autostart": true
        }`;
    } else if(path=='/right/path/to/new/container/beethoven.json') {
        return `{
            "name": "newContainer",
            "version": "1.1",
            "start_command": "node",
            "start_arguments": "index.js",
            "autostart": false
        }`;
    }
}

fsMock.existsSync = (path) => {
    if(path=='/right/path/to/new/container/beethoven.json') {
        return true;
    } else {
        return false;
    }
}

fsMock.writeFileSync = (path, buffer) => {
    if(path=='./containers.json') {
        mockContainersJson = buffer;
    }
}

describe('container management', () => {
    it('should load container paths from file', () => {
        paths = containers.loadContainerPathsFromFile();
        expect(paths.length).to.equal(1);
        expect(paths[0]).to.equal('/link/to/your/container/directory/')    
    })
    
    it('should load container config', () => {
        config = containers.loadContainerConfig('/link/to/your/container/directory/');
        expect(config).to.deep.equal({
            "name": "test",
            "version": "1.0",
            "start_command": "node",
            "start_arguments": ["app.js"],
            "autostart": true
        })
    })

    it('should load containers', () => {
        containers.loadContainers();
        expect(containers.containers.length).to.equal(1);
        expect(typeof containers.containers[0]).to.equal('object');
        expect(containers.containers[0] instanceof Container).to.be.be.true;
    });

    it('should add a container', () => {
        containers.init();
        expect(containers.containers.length).to.equal(1);
        expect(mockContainersJson).to.equal(`["/link/to/your/container/directory/"]`);
        containers.addContainer('/right/path/to/new/container/'); //Path and function needed
        expect(containers.containers.length).to.equal(2);
        expect(mockContainersJson).to.equal(`["/link/to/your/container/directory/","/right/path/to/new/container/"]`)
    });

    it('should throw an BeethovenFileNotFoundError', () => {
        //const ERROR_MSG = 'beethoven.json could not be found';
        expect(() => containers.addContainer('/wrong/path/to/container/')).to.throw(BeethovenFileNotFoundError)
    })

    it('should throw an ContainerAlreadyExistsError', () => {
        expect(() => {containers.addContainer('/right/path/to/new/container/')}).to.throw(ContainerAlreadyExistsError);
    })

    it('should remove a container', () => {
        containers.init();
        mockContainers = JSON.parse(mockContainersJson);
        expect(containers.containers.length).to.equal(mockContainers.length);
        containers.removeContainer('test'); //Config and function needed
        expect(containers.containers.length).to.equal(mockContainers.length-1);
    });

    //TODO - Just a placeholder yet
    it('should build a start list', () => {
        containers.init();
        //containers.addContainer({'name': 'test2', start_command: 'node test2.js'});
        //containers.addContainer({'name': 'lol', start_command: 'node lol.js', depends: ['test']});
        //expect(containers.containers.length).to.equal(3);

        let startList = containers.startList;
        //The containers on top-level are started first
        let EXPECTED_START_LIST = [];
        expect(startList).to.deep.equal(EXPECTED_START_LIST);
    })
})