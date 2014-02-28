var fs = require('fs');
var ini = require('ini');
var sec;
var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
var n = 11;
var dataArr = new Array(n);

var i=0,j;

for(sec in config)
{
	dataArr[i] = new Array(2);
	dataArr[i][0] = sec;
	dataArr[i][1] = sec.url;
	i++;
}

console.log(dataArr);

