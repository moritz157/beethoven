const daemonConnector = require('./daemon-connector.js');
const { DaemonNotRunningError } = require('../utils/errors.js');
const { statusToText } = require('../containers/container-status.enum.js');

module.exports = (args) => {
    daemonConnector.get('status', (err, containers) => {
        if(err) {
            if(err instanceof DaemonNotRunningError) console.log('Daemon is not running');
            else console.error(err)
        }
        else {
            let verbose = args.indexOf('-v') > -1;
            if(verbose) console.log('\nNAME\tSTATUS\tPATH')
            else  console.log('\nNAME\tSTATUS')
            console.log('------------------------');
            for(let c of containers) {
                let line = `${c.name}\t${statusToText(c.status)}`
                if(verbose) line+=`\t${c.path}`
                console.log(line)
            }
        }
    })
}