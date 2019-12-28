const fs = require('fs');
const inquirer = require('inquirer');
const initHandler = require('./init.handler.js');
const registerHandler = require('./register.handler.js');
const statusHandler = require('./status.handler.js');
const { startHandler, stopHandler, startAllHandler, stopAllHandler } = require('./container-actions.handler.js');
const daemon = require('../daemon/daemon.js');
const pathMagic = require('../utils/pathMagic.js');
var spawn = require('child_process').spawn;

const COMMANDS = {
    'help': {
        handler: showHelp
    },
    'version': {
        handler: versionHandler
    },
    'init': {
        handler: initHandler
    },
    'register': {
        handler: registerHandler
    },
    'daemon': {
        handler: daemonHandler
    },
    'status': {
        handler: statusHandler
    },
    'start': {
        handler: startHandler
    },
    'start-all': {
        handler: startAllHandler
    },
    'stop': {
        handler: stopHandler
    },
    'stop-all': {
        handler: stopAllHandler
    }
}

function cli(args) {
    //console.log(args); //TODO: more advanced logging here (#2)
    interpreteCommand(args);
}

function interpreteCommand(args) {
    if(args.length>2 && args[2]) {
        if(COMMANDS[args[2]]) {
            COMMANDS[args[2]].handler(args);
        } else {
            showHelp(); //TODO: more advanced help on unknown command, for example suggesting similar commands
        }
    } else {
        showHelp();
    }
}

function showHelp() {
    var helpPage = fs.readFileSync(pathMagic.dp(__dirname)+'helpPage.txt', {encoding: 'utf-8'});
    console.log(helpPage);
}

function versionHandler() {
    try {
        const packageInfo = JSON.parse(fs.readFileSync(pathMagic.dp(__dirname)+'../../package.json'));
        console.log(packageInfo.version);
    } catch(error) {
        console.log("An error occured while checking beethoven's version");
        console.log(__dirname);
        console.error(error);
    }
}

function daemonHandler(args) {
    //PLACEHOLDER
    //inquirer.prompt([{name:'daemon', message: "I'm the daemon!", type: 'list', choices: ['okay', 'cool']}]).then((answers)=>{})
    var detached = args[3] == '-detached' || args[3] == '--detached' || args[3] == '-d' || args[3] == '--d';
    if(detached) {
        console.log('Starting daemon detached...');
        let spawnCmd = 'beethoven';
        if(process.platform == 'win32') spawnCmd = 'beethoven.cmd' //Fix for windows
        var daemonProcess = spawn(spawnCmd, ['daemon'], { detached: true });
        console.log('Daemon started. PID = '+daemonProcess.pid);
        process.exit(0);
    }
    else {
        console.log('Starting daemon...');
        daemon.start();
    }
}

module.exports = {
    cli: cli
}