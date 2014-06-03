
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var querystring=require('querystring');

var contents = querystring.stringify({
	username:"----------------",
	password:"----------------",
	quickforward:"yes",
	handlekey:"ls"
});
var options={
	host:"www.backtrack.org.cn",
	path:"/member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes&inajax=1",
	method:"post",
	headers:{
		"Content-Type":"application/x-www-form-urlencoded",
		"Content-Length":contents.length,
		"Accept":"text/html,application/xml,application/json,application/javascrpt,*/*",
		"Accept-Language":"zh-CN",
		"Accept-Encoding":"gzip,deflate,sdch",
		"Cache-Control":"max-age=0",
		"Connection":"Keep-Alive",
		"Host":"www.backtrack.org.cn",
		"Referer":"www.backtrack.org.cn",
		"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36"
	}
};

var count = 0;
function bt(){
	var reqq=http.request(options, function(res){
		res.setEncoding("utf8");
		var headers = res.headers;
		var cookies = headers["set-cookie"];
		console.log("http to bt statusCode:" + res.statusCode);
		res.on("data",function(data){
			console.log(data);
		})
		res.on("end",function(){
			count++;
		})
	})
	reqq.write(contents);
	reqq.end();
}

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.html',ejs.__express);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

setInterval(bt,1000 * 60 * 30);

app.get('/', function(req, res, next){
	res.render('index',{title: count});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
