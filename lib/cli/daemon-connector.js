var ps = require('ps-node');
const request = require('request');
const { DaemonNotRunningError } = require('../utils/errors.js');

const DAEMON_PROTOCOL = 'http';
const DAEMON_ADRESS = 'localhost'
const DAEMON_PORT = '7737';
const DAEMON_URL = `${DAEMON_PROTOCOL}://${DAEMON_ADRESS}:${DAEMON_PORT}/`;

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

/**
 * 
 * @param {string} func The function's name 
 * @param {function callback(err, body) {
     
 }} 
 */
function get(func, callback) {
    request(DAEMON_URL+func, (err, res, body) => {
        if(err) {
            if(err.code == 'ECONNREFUSED') callback(new DaemonNotRunningError, body);
            else callback(err, body);
        }
        else {
            //console.log(body);
            var rawBody = body;
            try {
                body = JSON.parse(body);
            } catch(error) {
                body = rawBody;
            } finally {
                callback(undefined, body)
            }
        }
    })
}

/**
 * 
 * @param {string} func The function's name 
 * @param {object} data The data to pass
 * @param {function callback(err, body) {
     
 }} 
 */
function post(func, data, callback) {
    request({uri: DAEMON_URL+func, method: 'POST', json: data}, (err, res, body) => {
        if(err) {
            if(err.code == 'ECONNREFUSED') callback(new DaemonNotRunningError, body);
            else callback(err, body);
        }
        else {
            //console.log(body);
            var rawBody = body;
            try {
                body = JSON.parse(body);
            } catch(error) {
                body = rawBody;
            } finally {
                callback(undefined, body)
            }
        }
    })
}

module.exports = {
    isDaemonRunning: isDaemonRunning,
    get: get,
    post: post
}