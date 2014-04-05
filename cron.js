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
        requestConnect(config.host, config.port, config.name, config.mention, cb);
    }
}

function requester(url, name, mention, cb){
    request({
        url:url,
        timeout:5000
        }, function(err, res, body){
            console.log(name);
            var errFlag = false;
            if(err){
                output.push({
                    name:name,
                    err:err.code
                });
                errFlag = true;
            }
            else{
                var status={
                    name: name,
                    code: res.statusCode,
                };
                key='msg';
                //If our request was not successful            
                if(res.statusCode!==200){
                    key='err';
                    errFlag=true;
                }
                status[key] = statusCodes[res.statusCode];
                output.push(status);
            }
            if(errFlag){
                var lastNotificationTime = timeStamps[name];
                if(currentTime-lastNotificationTime > 30*60 || lastNotificationTime === undefined)
                    notifySlack(name, mention, url);
            }
            cb();
    });
}

function requestConnect(host, port, name, mention, cb){
    var lastNotificationTime = timeStamps[name];
    var client = net.connect({port: port, host:host}, function(err){
        console.log(name);
        if(err){
            output.push({
                name: name,
                err: err
            });            
            if(currentTime-lastNotificationTime > 30*60 || lastNotificationTime === undefined)
                notifySlack(name, mention);
        }
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
        console.log(name);
        output.push({
            name:name,
            err: err.syscall+' '+err.errno,
            code: err.code
        });
        if(currentTime-lastNotificationTime > 30*60 || lastNotificationTime === undefined)
            notifySlack(name, mention);
        cb();
        client.end();
    });
}

function notifySlack(name, mention, url){
    if(url)
        text = "<"+url+"|"+name+">";
    else
        text = name;
    //Linkify all the mentions
    mention = mention.replace(/@\w+/g,'<$&>');
    request.post({
        url: 'https://sdslabs.slack.com/services/hooks/incoming-webhook?token=oIhlY5LU0CpCXQn5zWucUsIr',
        json: {
            text : text+" is down. " + mention
        }
    });
    timeStamps[name] = currentTime;
}