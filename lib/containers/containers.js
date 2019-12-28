const fs = require('fs');
const Container = require('./container.class.js');
const pathMagic = require('../utils/pathMagic.js');
const { BeethovenFileNotFoundError, ContainerNotFoundError, ContainerAlreadyExistsError, ContainerAlreadyRunningError, ContainerNotRunningError } = require('../utils/errors.js');
const { STOPPED, RUNNING, STARTING, ERROR } = require('./container-status.enum.js');

var containers = [];
var startList = [];
var BASE_PATH = pathMagic.dp(__dirname)+'../../';

/**
 * @description Initializes the module by loading the containers from file
 */
function init(basePath) {
    if(basePath) BASE_PATH = pathMagic.dp(basePath);
    loadContainers();
    buildStartList();
    //console.log(containers);
}

/**
 * @description Loads the containers from file into the 'containers' variable
 */
function loadContainers() {
    containers.length = 0;
    var containerPaths = loadContainerPathsFromFile();
    for(let path of containerPaths) {
        let containerConfig = loadContainerConfig(path);
        containerConfig.path = pathMagic.dp(path);
        containers.push(new Container(containerConfig));
    }
}

/**
 * @description Loads the paths to each container from the containers.json
 */
function loadContainerPathsFromFile(path) {
    try {
        var containerPaths = JSON.parse(fs.readFileSync(BASE_PATH+'containers.json'))
        return containerPaths;
    } catch(error) {
        console.error(error);
    }
}

/**
 * @description Saves the paths of all containers stored in the containers-variable into the containers.json 
 */
function saveContainerPathsToFile() {
    let paths = [];
    for(let container of containers) {
        paths.push(container.path);
    }
    fs.writeFileSync(BASE_PATH+'containers.json', JSON.stringify(paths), {encoding: 'utf-8'});
}

function loadContainerConfig(path) {
    path = pathMagic.dp(path);
    try {
        var beethovenJson = JSON.parse(fs.readFileSync(path+'beethoven.json'));
        return beethovenJson;
        //console.log(beethovenJson);
    } catch(error) {
        console.error(error);
    }
}

/**
 * @description Registers a new container in the containers.json
 * 
 * @param {string} path The container's path
 */
function addContainer(path) {
    //Check if a beethoven.json is present at the given path
    path = pathMagic.dp(path);
    if(containers.findIndex(c => c.path == path) > -1) throw new ContainerAlreadyExistsError(path);
    if(fs.existsSync(path+'beethoven.json')) {
        let newConfig = loadContainerConfig(path);
        newConfig.path = path;
        containers.push(newConfig);
        saveContainerPathsToFile();
        buildStartList();
    } else {
        throw new BeethovenFileNotFoundError(path);
    }
}

/**
 * @description Removes a container from the containers.json
 * 
 * @param {string} name The name of the container to remove
 */
function removeContainer(name) {
    let targetIndex = containers.findIndex(c => c.name == name);
    if(targetIndex>-1) {
        containers.splice(targetIndex, 1);
        saveContainerPathsToFile();
    } else {
        throw new ContainerNotFoundError(name);
    }
}

/**
 * @description Starts a container
 * 
 * @param {string} name The name of the container to start
 */
function startContainer(name) {
    let target = containers.find(c => c.name == name);
    if(target) {
        if(target.status == STOPPED) {
            try {
                target.start();
            } catch (error) {
                console.error(error);
            }
        } else {
            throw new ContainerAlreadyRunningError(name);
        }
    } else {
        throw new ContainerNotFoundError(name);
    }
}

function startAllContainers() {
    for(let c of startList) {
        c.start();
    }
}

/**
 * @description Stops a container
 * 
 * @param {string} name The name of the container to stop
 */
function stopContainer(name) {
    let target = containers.find(c => c.name == name);
    if(target) {
        if(target.status == RUNNING) {
            try {
                target.stop();
            } catch (error) {
                console.error(error);
            }
        } else {
            throw new ContainerNotRunningError(name);
        }
    } else {
        throw new ContainerNotFoundError(name);
    }
}

function stopAllContainers() {
    let stopList = startList.slice().reverse();
    for(let c of stopList) {
        c.stop();
    }
}

//STILL NO REAL START LIST!
/**
 * @description Builds the dependency tree from the 'containers' variable
 */
function buildStartList() {
    //console.log(containers);
    if(containers) {
        this.startList = [...containers];
        //console.log(this.startList);
        containers.forEach((c, i) => {
            //console.log(c, i, c.depends);
            //console.log(this.startList.length);
            if(c.depends && c.depends.length > 0){
                //console.log('A DEPENDENCY IS HERE');
                for(let d of c.depends){
                    let dIndex = containerNameIndex(this.startList, d);
                    if(i < dIndex) {
                        array_move(this.startList, i, dIndex);
                        i = dIndex;
                    }
                }
            }
        });
        //console.log(this.startList);
    }
}

function containerNameIndex(arr, name) {
    return arr.findIndex(c => c.name == name);
}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};


module.exports = {
    init: init,
    loadContainers: loadContainers,
    loadContainerPathsFromFile: loadContainerPathsFromFile,
    loadContainerConfig: loadContainerConfig,
    addContainer: addContainer,
    removeContainer: removeContainer,
    startContainer: startContainer,
    startAllContainers: startAllContainers,
    stopContainer: stopContainer,
    stopAllContainers: stopAllContainers,
    buildStartList: buildStartList,
    containers: containers,
    startList: startList
}
//console.log(loadContainerPathsFromFile());
//loadContainerConfig(loadContainerPathsFromFile()[0]);
//TODO: Check for circular dependencies
//init();