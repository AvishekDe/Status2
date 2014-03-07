var net = require('net');
var fs = require('fs'),
    ini = require('./parser'),
    request = require("request"),
    statusCodes = require("./status.json"),
    _ = require('lodash');

var output={};
var count = Object.keys(ini).length;//Number of sections in our INI file
//This will make our anonymous function call after cb has been called count times
var cb = _.after(count, function(){
    fs.writeFile('output.json', JSON.stringify(output));
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
            output[name]=["ERR", err];
        else
            output[name]=[statusCodes[res.statusCode], res.statusCode];
        cb();
    });
}

function requestConnect(host, port, name, cb){
    var client = net.connect({port: port, host:host}, function(err){
        if(err)
            output[name] = ["ERR",err];
        else
            output[name]=['OK', 0];
        cb();
        client.end();
    });
}
