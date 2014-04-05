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
            }
            key='msg';
            if(res.statusCode!=200){
                key='err';
                fs.readFile('public/output.json' , 'utf-8' , function (err,data) {
                if(err) throw err;
                else
                {
                    var len = data.length;
                    var str = "";
                    for( var i=1; i< (len-1) ; i++)
                        str = str.concat(data[i]);
                    var array = JSON.parse("[" + str + "]");
                    
                    for(var i=0 ; i< (array.length) ; i++){
                        if(array[i]["name"] == name){
                            var lasttime = array[i]["time"]; //obtaining a JSONdate
                            var then = new Date(lasttime);
                            var now = new Date();
                            var flag = 0;
                            var jsondate = now.toJSON();
                            if(now.getFullYear()==then.getFullYear()){
                                if(now.getMonth() == then.getMonth()){
                                    if(now.getDate() == then.getDate()){
                                        var mindif = (now.getHours()*60)+now.getMinutes() - ((then.getHours()*60)+then.getMinutes());
                                        if(mindif <= 30){
                                            flag = 1;
                                        }
                                    }
                                }
                            }
                            if(flag == 0){
                                request.post({
                                        url: 'https://sdslabs.slack.com/services/hooks/incoming-webhook?token=oIhlY5LU0CpCXQn5zWucUsIr',
                                        json: {
                                            "text" : name+" is down. It needs your attention. <"+url+">. Please see to it <"+mention+">",
                                        },
                                    },

                                    function (error,response,body) {
                                    }       
                                );
                                status['time'] = jsondate;
                            }
                        }

                    }
                }
            });
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
            })
        else
            output.push({
                name: name,
                code: 0,
                msg: "OK"
            })
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
