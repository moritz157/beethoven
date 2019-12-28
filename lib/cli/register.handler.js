const fs = require('fs');
const pathMagic = require('../utils/pathMagic.js');
const { isDaemonRunning } = require('./daemon-connector.js');
const { loadContainerConfig, init, addContainer } = require('../containers/containers.js');

module.exports = (args) => {
    var workDir = pathMagic.dp(process.cwd());
    if(fs.existsSync(workDir+'beethoven.json')) {
        try {
            let config = loadContainerConfig(workDir);
            if(config) {
                console.log('Checking if daemon is running...');
                isDaemonRunning((daemonIsRunning, daemonProcess) => {
                    if(daemonIsRunning) {
                        console.log('Daemon is running');
                    } else {
                        var baseDir = pathMagic.dp(process.argv[1]+'/../../');
                        //console.log('BASEDIR', baseDir);
                        init(baseDir);
                        addContainer(workDir);
                        console.log(`Container '${config.name}' has been registered`);
                    }
                })
            } else {
                console.log('There is no valid configuration inside the beethoven.json. Try using "beethoven init" to create one')
            }
        } catch(error) {
            console.error(error);
            console.log('Something is wrong with your beethoven.json');
        }
    } else {
        console.log('There is no beethoven.json present in this directory. Try using "beethoven init" to create one')
    }
}