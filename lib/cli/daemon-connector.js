var ps = require('ps-node');

function isDaemonRunning (callback) {
    //console.log(process.argv[1]);
    // A simple pid lookup 
    ps.lookup({
        command: 'node',
        psargs: 'ux'
        }, function(err, resultList ) {
        if (err) {
            throw new Error( err );
        }
    
        isRunning = false;
        for(result of resultList) {
            if( result ){
                //console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', result.pid, result.command, result.arguments);
                if(result.arguments instanceof Object && result.arguments[0].replace(/\\\\/g, '\\')==process.argv[1] && result.arguments[1]=='daemon') {
                    //console.log('DAEMON IS RUNNING');
                    isRunning = true;
                    callback(true, result);
                }
            }
        }
        if(!isRunning) callback(false, undefined);
    });
}
module.exports = {
    isDaemonRunning: isDaemonRunning
}