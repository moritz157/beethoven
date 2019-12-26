const fs = require('fs');
const COMMANDS = {
    'help': {
        handler: showHelp
    },
    'version': {
        handler: versionHandler
    }
}

function cli(args) {
    //console.log(args); //TODO: more advanced logging here (#2)
    interpreteCommand(args);
}

function interpreteCommand(args) {
    if(args.length>2 && args[2]) {
        if(COMMANDS[args[2]]) {
            COMMANDS[args[2]].handler();
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

module.exports = {
    cli: cli
}