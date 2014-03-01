var fs = require('fs');
var ini = require('ini');
var iniReader = require('inireader');
var parser = new iniReader.IniReader();
parser.load('./config.ini');
var sec;
var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
var n = 11;
var dataArr = new Array(n);
var i=0,j;
for(sec in config)
{
	var str = sec.toString();
	secm = parser.param(str); // obtains block
	if(secm.hasOwnProperty('url'))
	{
		dataArr[i] = new Array(3);
		dataArr[i][0] = parser.param(str+'.tag');
		dataArr[i][1] = "true";
		dataArr[i][2] = parser.param(str+'.url');
	}
	else
	{
		dataArr[i] = new Array(4);
		dataArr[i][0] = parser.param(str+'.tag');
		dataArr[i][1] = "false";
		dataArr[i][2] = parser.param(str+'.port');
		dataArr[i][3] = parser.param(str+'.host');
	}
	i++;
}
module.exports = {
	expArr : dataArr,
	value : n 
}