var ini = require('iniparser');
var cfg = ini.parseSync('./config.ini');
module.exports=cfg;
