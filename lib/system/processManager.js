var spawn = require('child_process').spawn;

/**
 * 
 * @param {string} cmd The command to spawn the process with (command and arguments separated by spaces) 
 * 
 * @returns {Object} prc The spawned process-object
 */
function spawnProcess(cmd) {
    let args = cmd.split(' ');
    let command = args.shift();
    var prc = spawn(command, args, {  //Named 'prc' instead of 'process' to prevent conflicts
        detached: true
    });
    return prc;
}

/**
 * 
 * @param {Object} prc The process to kill 
 */
function stopProcess(prc) {
    return prc.kill()
}

module.exports = {
    spawnProcess: spawnProcess,
    stopProcess: stopProcess
}