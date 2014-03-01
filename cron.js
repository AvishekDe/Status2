var fs = require('fs'),
    ini = require('./parser'),
    request = require("request"),
    file = fs.openSync('status.csv', 'w'),
    statusCodes = require("./status.json");

//write csv headers
fs.writeSync(file, "name, status, msg\n");

for(var i in ini){
    var config = ini[i];
    console.log(config.name);
    if(config.url){
        requester(config.url, file, config.name);
    }
    else{

    }
}

function requester(url, file, name){
    request(url, function(err, res, body){
        if(err)
            fs.writeSync(file, name+","+"ERR"+","+err+"\n");
        else
        {
            fs.writeSync(file, name+","+statusCodes[res.statusCode]+", "+res.statusCode+"\n");
        }
    });
}
