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
    console.log(config.name);
    if(config.url)
    {
        requester(config.url, config.name, cb);
    }
    else
    {
        //try connecting to the host,port and call cb once its done
        var client = net.connect({port: 411 , host:'dc.sdslabs.co.in'}, function(err , res , body) 
        {
            //'connect' listener
            if(err)
                output[config.name] = ["ERR",err];
            else{
                    client.on('data', function(data) 
                    {
                        
                        //console.log(config.name); Config.name referring to Blogs here for some reason
                        output["Direct Connect ++"]=['OK', 200]; 
                      client.end();
                    });
                }
             cb();
        });
        
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
