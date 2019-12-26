/**
 * 
 * @param {string} path The path to magically fix
 */
function directoryPath(path) {
    path = path.replace(/\\/g, '/'); //Replace all backslashes with regular slashes
    if(path.endsWith('.json')) { //Only fixes .json files in directory path; Possibly extend to more filetypes
        let pathParts = path.split('/');
        pathParts.pop();
        path = pathParts.join('/');
    }
    if(!path.endsWith('/')) {
        path += '/';
    }
    return path;
}

module.exports = {
    directoryPath: directoryPath
}