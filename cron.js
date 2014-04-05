var net = require('net'),
    fs = require('fs'),
    ini = require('./parser'),
    request = require("request"),
    statusCodes = require("./status.json"),
    _ = require('lodash');

var output=[], 
    timeStamps = fs.readFileSync('time.json',{encoding:'utf8'}),
    currentTime = Math.floor(Date.now()/1000),
    timeStamps = (timeStamps==='') ? {} : JSON.parse(timeStamps);

//We open the time.json file for reading+writing, and create it if it doesn't exist. If the file is blank, use a blank object ({})
var count = Object.keys(ini).length;//Number of sections in our INI file
//This will make our anonymous function call after cb has been called count times
var cb = _.after(count, function(){
    fs.writeFile('public/output.json', JSON.stringify(output));
    fs.writeFile('time.json', JSON.stringify(timeStamps));
});
for(var i in ini)
{
    var config = ini[i];
    if(config.url){
        requester(config.url, config.name, config.mention, cb);
    }
    else{
        //try connecting to the host,port and call cb once its done
        requestConnect(config.host, config.port, config.name, cb);
    }
}

function requester(url, name, mention, cb){
    request(url, function(err, res, body){
        if(err)
            output.push({
                name:name,
                err:err
            });
        else{
            var status={
                name: name,
                code: res.statusCode,
            };
            key='msg';
            //If our request was not successful            
            if(res.statusCode!==200){
                key='err';
                var lastNotificationTime = timeStamps[name];
                if(currentTime-lastNotificationTime > 30*60 || lastNotificationTime === undefined)
                    notifySlack(name, mention, url);
            }
            status[key] = statusCodes[res.statusCode];
            output.push(status);
        }
        cb();
    });
}

function requestConnect(host, port, name, cb){
    var client = net.connect({port: port, host:host}, function(err){
        if(err)
            output.push({
                name: name,
                err: err
            });
        else
            output.push({
                name: name,
                code: 0,
                msg: "OK"
            });
        cb();
        client.end();
    });
    client.on('error', function(err){
        output.push({
            name:name,
            err: err.syscall+' '+err.errno,
            code: err.code
        });
        cb();
        client.end();
    });
}

function notifySlack(name, mention, url){
    if(url)
        text = "<"+url+"|"+name+">";
    else
        text = name;
    request.post({
        url: 'https://sdslabs.slack.com/services/hooks/incoming-webhook?token=oIhlY5LU0CpCXQn5zWucUsIr',
        json: {
            text : text+" is down. <" + mention + ">"
        }
    });
    timeStamps[name] = currentTime;
}