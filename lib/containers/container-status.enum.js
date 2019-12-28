const STOPPED = 0;
const RUNNING = 1;
const STARTING = 2;
const ERROR = 3;

module.exports = {
    STOPPED: STOPPED,
    RUNNING: RUNNING,
    STARTING: STARTING,
    ERROR: ERROR,
    statusToText: (status) => {
        switch(status) {
            case STOPPED: 
                return 'STOPPED';
            case RUNNING:
                return 'RUNNING';
            case STARTING:
                return 'STARTING';
            case ERROR:
                return 'ERROR';
            default:
                return;
        }
    }
}