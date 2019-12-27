const fs = require('fs');
const inquirer = require('inquirer');
const pathMagic = require('../utils/pathMagic.js');
const { loadContainerConfig, } = require('../containers/containers.js');

module.exports = (args) => {
    var workDir = pathMagic.dp(process.cwd());
    if(fs.existsSync(workDir+'beethoven.json')) {
        try {
            let config = loadContainerConfig(workDir);
            if(config) {
                console.log('This directory is already initialized:\n', JSON.stringify(config));
            } else {
                inputParams();
            }
        } catch(error) {
            console.error(error);
            console.log('Something is wrong with your beethoven.json');
        }
    } else {
        inputParams();
    }
}

function inputParams() {
    inquirer.prompt([
        {
            name: 'name',
            type: 'text',
            message: 'Name of the container:'
        }, 
        {
            name: 'start_command',
            type: 'text',
            message: 'The command to start the container:',
            default: 'node app.js'
        },
        {
            name: 'version',
            type: 'text',
            message: "The container's version:",
            default: '1.0'
        },
        {
            name: 'autostart',
            type: 'list',
            message: 'Should it be started automatically?',
            choices: ['yes', 'no'],
            default: 'yes'
        }, {
            name: 'depends',
            type: 'string',
            message: 'On which other containers does it depend? (Names separated by , without spaces)'
        }
    ]).then(answers => {
        //console.log(answers);
        if(answers.name && answers.start_command) {
            if(answers.depends) answers.depends = answers.depends.split(',');
            answers.autostart = answers.autostart == 'yes';
            createBeethovenFile(answers);
            console.log('\nbeethoven.json successfully created.\nTo register the container just use "beethoven register"');
        } else {
            console.log('You have to give at least a name and start command');
            inputParams();
        }
    })
}

function createBeethovenFile(beethovenConfig) {
    fs.writeFileSync(pathMagic.dp(process.cwd())+'beethoven.json', JSON.stringify(beethovenConfig));
}