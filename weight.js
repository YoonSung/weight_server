console.log('\u001b[1m');
console.log('\u001b[32m', '=============Start=============');


var fs = require('fs');
var http = require('http');
var express = require('express');
var mysql = require('mysql');

//Use Connection Pool
var pool = mysql.createPool({
//	host		: '54.178.137.153',
	host		: '127.0.0.1',
//	host		: '172.31.7.199',
//	user		: 'root',
	user		: 'yoonsung',
	database	: 'weight',
	charset		: 'UTF8_GENERAL_CI',
	timezone	: 'local',
	password	: 'wlsduddl'
});	


//webserver
var app = express();

//for parsing request data
app.use(express.bodyParser());//({uploadDir:__dirname + '/images'}));


// app.get('/', function(request, response)
// {
// 	fs.readFile('HTMLPage.html', function(error, data)
// 	{
// 		response.send(data.toString());
// 	});
// });

app.post('/upload', function(request, response) {
	
	fs.readFile(request.files.image.path, function(error, data) {
			var filePath = __dirname + "/images/" + request.files.image.name;
			console.log(filePath);
			
			fs.writeFile(filePath, data, function(err) {
				if (error) {
					response.send("fail");
					//response.send(err);
				} else {
					
					requestQuery(			
						"INSERT INTO tbl_weight(id, isMan, weight, language, path) values( ?, ?, ?, ?, ? ) "
//						+"'" + request.body.id + "',"
//					 	+ request.body.isMan + ","
//						+ request.body.weight + ","
//						+"'" + request.body.language + "',"
//						+"'" + request.body.path + "');"
						
						, [request.body.id, Boolean(request.body.isMan), parseFloat(request.body.weight), request.body.language, request.body.path]
						,function(error, oResult) {
							console.log("oResult : ", oResult);
							var isSuccess =false;
							
							if ( oResult != null || oResult != undefined || oResult["affectedRows"] != null) {						
								if ( oResult["affectedRows"] != null ) 
									isSuccess = true;
							}
							
							response.send(""+isSuccess);
						}
					);
					
					//response.send(filePath);
					//response.json("true");
					//response.send("true");
				}	
			});
		});

	//response.redirect('/');
});

app.post('/getList', function(request, response) {
	console.log("/getList!!!!");
	requestQuery(
		"SELECT * FROM tbl_weight WHERE language = (SELECT language FROM tbl_weight WHERE id = ?)"
		, [request.body.id]
		, function(error, aResult) {
			var isSuccess = false;
			if ( ! error ) {
				isSuccess= true;
			}
			response.json({"isSuccess": isSuccess, "list": aResult});
		}
	);
});

//Execute Query
function requestQuery(sql, aInsertValues, callbackFunction) {
	
	//sql QueryGenerator. 
	//Like Java PreparedStatement Class
	var sql = mysql.format(sql, aInsertValues);	
	
	var resultData = pool.getConnection(function(err, connection) {
		//test
		console.log("sql : ", sql);
		//when error occur
		
		if (err) {
			console.log("error occur : ",err);
		} else {
			//connection request
			connection.query(sql, function(err, queryResult) {
				console.log("queryResult : ",queryResult);
				console.log("callbackFunction : ",callbackFunction);
				callbackFunction(err, queryResult);
			});
		}
		
	});
};

//server
http.createServer(app).listen(8080, function() {
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
