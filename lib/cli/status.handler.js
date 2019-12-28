const request = require('request');
const { statusToText } = require('../containers/container-status.enum.js');

module.exports = (args) => {
    request('http://localhost:7737/status', (err, res, body) => {
        if(err) console.error(err)
        else {
            //console.log(body);
            let containers = JSON.parse(body);
            let verbose = args.indexOf('-v') > -1;
            if(verbose) console.log('NAME\tSTATUS\tPATH')
            else  console.log('NAME\tSTATUS')
            console.log('------------------------');
            for(let c of containers) {
                let line = `${c.name}\t${statusToText(c.status)}`
                if(verbose) line+=`\t${c.path}`
                console.log(line)
            }
        }
    })
}