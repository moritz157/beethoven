const express = require('express');
const bodyParser = require('body-parser');
const { ContainerAlreadyExistsError, BeethovenFileNotFoundError, ContainerNotFoundError } = require('../utils/errors.js');

const app = express();
app.use(bodyParser.json());

var containers = require('../containers/containers.js');

const PORT = 7737;

app.get('/', (req, res) => {
    res.send({status: 'ok', message: 'Welcome to hell!'});
});

//Adds a container
app.post('/addContainer', (req, res) => {
    if(req.body.path) {
        console.log('Path:', req.body.path);
        try {
            containers.addContainer(req.body.path);
            res.send({status: 'ok', message: 'container registered'});
        } catch(error) {
            if(error instanceof ContainerAlreadyExistsError) res.send({status: 'error', message: error})
            else if(error instanceof BeethovenFileNotFoundError) res.send({status: 'error', message: error})
            else {
                res.status(500).send({status: 'error', message: 'Internal server error'});
                console.error(error);
            }
        }
    } else {
        res.status(400);
    }
});

//Removes a container
app.post('/removeContainer', (req, res) => {
    if(req.body.name) {
        console.log('Name:', req.body.name);
        try {
            containers.removeContainer(req.body.name);
            res.send({status: 'ok', message: 'container removed'});
        } catch(error) {
            if(error instanceof ContainerNotFoundError) res.send({status: 'error', message: error});
            res.status(500).send({status: 'error', message: 'Internal server error'});
            console.error(error);
        }
    } else {
        res.status(400);
    }
});

//Stats one or multiple container(s)
app.post('/start', () => {

});

//Gets the current container status
app.get('/status', () => {

});

//Stops one or multiple container(s)
app.post('/stop', () => {

})

function start() {
    
    containers.init();
    app.listen(PORT, () => {
        console.log('Webserver started on Port '+PORT);
    })
}

module.exports = {
    start: start
}