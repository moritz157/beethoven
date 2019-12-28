const express = require('express');
const bodyParser = require('body-parser');
const { ContainerAlreadyExistsError, BeethovenFileNotFoundError, ContainerNotFoundError, ContainerAlreadyRunningError, ContainerNotRunningError } = require('../utils/errors.js');

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
        //console.log('Path:', req.body.path);
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
        res.status(400).send({status: 'error', message: 'Missing "path" in request-body'});
    }
});

//Removes a container
app.post('/removeContainer', (req, res) => {
    if(req.body.name) {
        //console.log('Name:', req.body.name);
        try {
            containers.removeContainer(req.body.name);
            res.send({status: 'ok', message: 'container removed'});
        } catch(error) {
            if(error instanceof ContainerNotFoundError) res.send({status: 'error', message: error});
            else {
                res.status(500).send({status: 'error', message: 'Internal server error'});
                console.error(error);
            }
        }
    } else {
        res.status(400).send({status: 'error', message: 'Missing "name" in request-body'});
    }
});

//Starts one container
app.post('/start', (req, res) => {
    if(req.body.name) {
        try {
            containers.startContainer(req.body.name);
            res.send({status: 'ok', message: 'container started'});
        } catch(error) {
            if(error instanceof ContainerNotFoundError || error instanceof ContainerAlreadyRunningError) res.send({status: 'error', message: error});
            else {
                res.status(500).send({status: 'error', message: 'Internal server error'});
                console.error(error);
            }
        }
    } else {
        res.status(400).send({status: 'error', message: 'Missing "name" in request-body'});
    }
});

//Stops one container
app.post('/stop', (req, res) => {
    if(req.body.name) {
        try {
            containers.stopContainer(req.body.name);
            res.send({status: 'ok', message: 'container stopped'});
        } catch(error) {
            if(error instanceof ContainerNotFoundError || error instanceof ContainerNotRunningError) res.send({status: 'error', message: error});
            else {
                res.status(500).send({status: 'error', message: 'Internal server error'})
                console.error(error);
            }
        }
    } else {
        res.status(400).send({status: 'error', message: 'Missing "name" in request-body'});
    }
})

//Gets the current container status
app.get('/status', (req, res) => {
    let result = [];
    for(let c of containers.containers) {
        result.push({name: c.name, status: c.status, path: c.path})
    }
    res.send(result);
});

function start() {
    
    containers.init();
    app.listen(PORT, () => {
        console.log('Webserver started on Port '+PORT);
    })
}

module.exports = {
    start: start
}