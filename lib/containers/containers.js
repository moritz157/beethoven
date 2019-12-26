const fs = require('fs');
const Container = require('./container.class.js');
var containers = [];
var startList = [];

/**
 * @description Initializes the module by loading the containers from file
 */
function init() {
    loadContainers();
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
        containerConfig.path = path;
        containers.push(new Container(containerConfig));
    }
}

/**
 * @description Loads the paths to each container from the containers.json
 */
function loadContainerPathsFromFile() {
    try {
        var containerPaths = JSON.parse(fs.readFileSync('./containers.json'))
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
    fs.writeFileSync('./containers.json', JSON.stringify(paths), {encoding: 'utf-8'});
}

function loadContainerConfig(path) {
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
    if(fs.existsSync(path+'beethoven.json')) {
        let newConfig = loadContainerConfig(path);
        newConfig.path = path;
        containers.push(newConfig);
        saveContainerPathsToFile();
        buildDependencyTree();
    } else {
        throw new Error('beethoven.json could not be found');
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
        throw new Error('container not found');
    }
}

/**
 * @description Builds the dependency tree from the 'containers' variable
 */
function buildDependencyTree() {
    startList = [];
}

module.exports = {
    init: init,
    loadContainers: loadContainers,
    loadContainerPathsFromFile: loadContainerPathsFromFile,
    loadContainerConfig: loadContainerConfig,
    addContainer: addContainer,
    removeContainer: removeContainer,
    containers: containers,
    startList: startList
}
//console.log(loadContainerPathsFromFile());
//loadContainerConfig(loadContainerPathsFromFile()[0]);
//TODO: Check for circular dependencies
//init();