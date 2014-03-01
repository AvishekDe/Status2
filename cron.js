var fs = require('fs');

fs.writeFile('status.txt', 'CURRENT STATUS OF SDS WEB APPS', function (err) {
  if (err) throw err;
});
fs.appendFile('status.txt', '\n-----------------------------------------\n' , function (err){
	if(err) throw err;
});

var parser = require('./parser.js');
var n=parser.value;
var arr=parser.expArr;
var url = "" , name = "";
var request = require('request');
var i;

for(i=0;i<n;i++)
{
	if(arr[i][1]) // For Apps with URL
	{
		url = arr[i][2];
		name = arr[i][0];
		request('http://'+url, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
			    fs.appendFile('status.txt' , (i+1)+'.\t'+name+'\t 200 OK \n' , function (err){
			    	if (err) throw err;
			    });
		  }
		   else
		   {
		   		fs.appendFile('status.txt' , (i+1)+'.\t'+name+'\t 404 NOT FOUND \n' , function (err){
		    	if (err) throw err;
		    	});
		   }
		});
	}
	else // For DC++
	{

	}
}