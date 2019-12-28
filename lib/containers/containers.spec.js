const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const Container = require('./container.class.js');
const pathMagic = require('../utils/pathMagic.js');

const { BeethovenFileNotFoundError, ContainerAlreadyExistsError } = require('../utils/errors.js');


var fsMock = {}
var containers = proxyquire('./containers.js', {'fs': fsMock});
var BASE_PATH = pathMagic.dp(__dirname)+'../../';

mockContainersJson = `["/link/to/your/container/directory/"]`;
fsMock.readFileSync = (path) => {
    if(path==BASE_PATH+'containers.json') {
        return mockContainersJson;
    } else if(path=='/link/to/your/container/directory/beethoven.json') {
        return `{
            "name": "test",
            "version": "1.0",
            "start_command": "node",
            "start_arguments": ["app.js"],
            "autostart": true,
            "depends": ["newContainer"]
        }`;
    } else if(path=='/right/path/to/new/container/beethoven.json') {
        return `{
            "name": "newContainer",
            "version": "1.1",
            "start_command": "node",
            "start_arguments": ["index.js"],
            "autostart": false
        }`;
    } else if(path=='/another/container/beethoven.json') {
        return `{
            "name": "anotherContainer",
            "version": "1.1",
            "start_command": "node",
            "start_arguments": ["index.js"],
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
    if(path==BASE_PATH+'containers.json') {
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
            "autostart": true,
            "depends": ["newContainer"]
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
        mockContainersJson = `["/link/to/your/container/directory/","/right/path/to/new/container/"]`;
        containers.init();
        //containers.addContainer('/link/to/your/container/directory/');
        //containers.addContainer('/another/container/');
        expect(containers.containers.length).to.equal(2);

        //The containers on top-level are started first
        let EXPECTED_START_LIST = [
            {
                "_status": 0,
                "autostart": false,
                "depends": [],
                "name": "newContainer",
                "path": "/right/path/to/new/container/",
                "start_arguments": [
                    "index.js"
                ],
                "start_command": "node",
                "version": "1.1"
            },
            {
                "_status": 0,
                "autostart": true,
                "depends": [
                    "newContainer"
                ],
                "name": "test",
                "path": "/link/to/your/container/directory/",
                "start_arguments": [
                    "app.js"
                ],
                "start_command": "node",
                "version": "1.0"
            }
        ];
        containers.buildStartList();
        let startList = containers.startList;
        console.log(startList)
        expect(startList).to.deep.equal(EXPECTED_START_LIST);
    })
})