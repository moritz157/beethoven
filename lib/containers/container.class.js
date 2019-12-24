module.exports = class Container {

    /**
     * 
     * @param {object} config
     * @param {string} config.name The container's name
     * @param {string} config.path The container's filepath
     * @param {string} config.start_command The command to start the container
     * @param {string} [config.version] The container's version (default=1.0)
     * @param {boolean} [config.autostart] If the container should be started automatically (default=false)
     * @param {string[]} [config.depends] A list of container's names, which need to be started first
     */
    constructor(config) {
        if(!config || typeof config != 'object') throw new Error('invalid config')
        if(!config['name'] || !config['path'] || !config['start_command']) throw new Error('incomplete config');
        
        this.name = config['name'];
        this.path = config['path'];
        this.start_command = config['start_command'];

        this.version = config['version'] || '1.0';
        this.autostart = config['autostart'] || false;
        this.depends = config['depends'] || [];
    }

    start() {
        //system modules needed for this
    }

    get status () {
        return 0;
    }
}