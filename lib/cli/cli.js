const fs = require('fs');
const inquirer = require('inquirer');
const initHandler = require('./init.handler.js');
const registerHandler = require('./register.handler.js');
const daemon = require('../daemon/daemon.js');

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
    var helpPage = fs.readFileSync('./lib/cli/helpPage.txt', {encoding: 'utf-8'});
    console.log(helpPage);
}

function versionHandler() {
    try {
        const packageInfo = JSON.parse(fs.readFileSync('./package.json'));
        console.log(packageInfo.version);
    } catch(error) {
        console.log("An error occured while checking beethoven's version");
        console.error(error);
    }
}

function daemonHandler() {
    //PLACEHOLDER
    //inquirer.prompt([{name:'daemon', message: "I'm the daemon!", type: 'list', choices: ['okay', 'cool']}]).then((answers)=>{})
    console.log('Starting daemon...');
    daemon.start();
}

module.exports = {
    cli: cli
}