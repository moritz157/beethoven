const webServer = require('./webServer.js');

function start() {
    webServer.start();
}

module.exports = {
    start: start
}