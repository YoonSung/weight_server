console.log('\u001b[1m');
console.log('\u001b[32m', '=============Start=============');


var fs = require('fs');
var http = require('http');
var express = require('express');

var app = express();

app.use(express.bodyParser());//({uploadDir:__dirname + '/images'}));

app.get('/', function(request, response)
{
	fs.readFile('HTMLPage.html', function(error, data)
	{
		response.send(data.toString());
	});
});

app.post('/upload', function(request, response) {
	console.log(request.body);
	console.log(request.files);
	
	fs.readFile(request.files.image.path, function(error, data) {
			var filePath = __dirname + "/images/" + request.files.image.name;
			console.log(filePath);
			
			fs.writeFile(filePath, data, function(err) {
				if (error) {
					response.json({ result: "fail" });
					//response.send(err);
				} else {
					//response.send(filePath);
					response.json({ result: "success" });
				}	
			});
		});
	
	//response.redirect('/');
});

http.createServer(app).listen(9000, function() {
	console.log('Server running');
});

console.log('\u001b[0m');


// var express = require('express');
// var bodyParser = require('body-parser');
// 
// var app = express();
// app.use(bodyParser());
// 
// var fs = require('fs');
// var http = require('http');
// 
// //bodyParser 설정
// //Client Page의 Tag에 접근하기 위해서 필요
// //app.use(bodyParser({uploadDir: __dirname + '/images'}));
// //app.use(express.limit('10mb'));
// //app.use(app.router);
// express.multipart();
// 
// app.get('/', function(request, response) {
// 	console.log("in /");
// 	
//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.write("Hello\r\n");
//     response.write("World\r\n");
//     response.end();
// 	console.log("hello hello");
// });
// 
// 
// //html test
// app.get('/main', function (request, response) {
// 	fs.readFile('main.html', function (error, data) {
// 		response.writeHead(200, {'Content-Type': 'text/html'});
// 		response.end(data);
// 	});
// })
// 
// 
// app.post('/upload', function(request, response) {
// 	//bodyParser가 없을 경우  request.files 에서 에러발생
// 
// 	console.log(request.body);
// 	console.log(request.body.test);
// 	
// 	// fs.readFile(request.files.uploadFile.path, function(error, data) {
// 	// 	var filePath = __dirname + "\\files\\" + request.files.uploadFile.name;
// 	// 	
// 	// 	if (error) {
// 	// 		throw err;
// 	// 	} else {
// 	// 		response.redirect()
// 	// 	}
// 	// });
// });
// 
// 
// http.createServer(app).listen(9000, function(error, data) {
// 	console.log('Server running');
// });