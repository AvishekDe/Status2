var net = require('net');
var fs = require('fs'),
    ini = require('./parser'),
    request = require("request"),
    statusCodes = require("./status.json"),
    _ = require('lodash');

var output=[];
var count = Object.keys(ini).length;//Number of sections in our INI file
//This will make our anonymous function call after cb has been called count times
var cb = _.after(count, function(){
    fs.writeFile('public/output.json', JSON.stringify(output));
});
for(var i in ini)
{
    var config = ini[i];
    if(config.url){
        requester(config.url, config.name, cb);
    }
    else{
        //try connecting to the host,port and call cb once its done
        requestConnect(config.host, config.port, config.name, cb);
    }
}

function requester(url, name, cb){
    request(url, function(err, res, body){
        if(err)
            output.push({
                name:name,
                err:err
            });
        else
            var status={
                name: name,
                code: res.statusCode
            }
            key='msg';
            if(res.statusCode!=200)
                key='err';
            status[key] = statusCodes[res.statusCode];
            output.push(status);
        cb();
    });
}

function requestConnect(host, port, name, cb){
    var client = net.connect({port: port, host:host}, function(err){
        if(err)
            output.push({
                name: name,
                err: err
            })
        else
            output.push({
                name: name,
                code: 0
            })
        cb();
        client.end();
    });
}
