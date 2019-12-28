const { InvalidContainerConfigError } = require('../utils/errors.js');
var processManager = require('../system/processManager.js');
const { STOPPED, RUNNING, STARTING, ERROR } = require('./container-status.enum.js');

module.exports = class Container {

    /**
     * 
     * @param {object} config
     * @param {string} config.name The container's name
     * @param {string} config.path The container's filepath
     * @param {string} config.start_command The command to start the container
     * @param {string[]} [config.start_arguments] The arguments passed with the start_command
     * @param {string} [config.version] The container's version (default=1.0)
     * @param {boolean} [config.autostart] If the container should be started automatically (default=false)
     * @param {string[]} [config.depends] A list of container's names, which need to be started first
     */
    constructor(config) {
        if(!config || typeof config != 'object') throw new InvalidContainerConfigError();
        if(!config['name'] || !config['path'] || !config['start_command']) throw new InvalidContainerConfigError();
        
        this.name = config['name'];
        this.path = config['path'];
        this.start_command = config['start_command'];

        this.start_arguments = config['start_arguments'] || [];
        this.version = config['version'] || '1.0';
        this.autostart = config['autostart'] || false;
        this.depends = config['depends'] || [];
        this._status = STOPPED;
    }

    start() {
        //system modules needed for this
        this._status = STARTING;
        try {
            this.prc = processManager.spawnProcess(this.start_command, this.start_arguments)
            this._status = RUNNING;
        } catch(error) {
            this._status = ERROR;
            console.error(error);
        }
    }

    stop() {
        try {
            if(processManager.stopProcess(this.prc)) this._status = STOPPED
            else this._status = ERROR;
        } catch(error) {
            this._status = ERROR;
            console.error(error);
        }
    }

    get status () {
        return this._status;
    }

    set status(status) {
        if(status >= STOPPED && status <= ERROR) this._status = status
    }
}