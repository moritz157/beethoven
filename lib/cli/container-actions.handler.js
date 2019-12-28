const daemonConnector = require('./daemon-connector.js');

function startHandler(args) {
    if(args[3]) {
        daemonConnector.post('start', {name: args[3]}, (err, result) => {
            if(err) {
                if(err instanceof DaemonNotRunningError) console.log('Daemon is not running');
                else console.error(err)
            }
            else {
                if(result.status=='ok'){
                    console.log('Container started');
                } else if(result.status=='error') {
                    console.log('An error occured:\n', result);
                }
            }
        })
    } else {
        console.log('Please provide a container name: beethoven start <CONTAINER_NAME>')
    }
}

function stopHandler(args) {
    if(args[3]) {
        daemonConnector.post('stop', {name: args[3]}, (err, result) => {
            if(err) {
                if(err instanceof DaemonNotRunningError) console.log('Daemon is not running');
                else console.error(err)
            }
            else {
                if(result.status=='ok'){
                    console.log('Container stopped');
                } else if(result.status=='error') {
                    console.log('An error occured:\n', result);
                }
            }
        })
    } else {
        console.log('Please provide a container name: beethoven stop <CONTAINER_NAME>')
    }
}

function startAllHandler(args) {

}

function stopAllHandler(args) {

}

module.exports = {
    startAllHandler: startAllHandler,
    startHandler: startHandler,
    stopHandler: stopHandler,
    stopAllHandler: stopAllHandler
}