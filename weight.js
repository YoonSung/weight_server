console.log('\u001b[1m');
console.log('\u001b[32m', '=============Start=============');


var fs = require('fs');
var http = require('http');
var express = require('express');
var mysql = require('mysql');

//Use Connection Pool
var pool = mysql.createPool({
	host		: '54.178.137.153',
//	host		: '127.0.0.1',
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
app.get('/image', function(request, response) {
	
	var filePath = __dirname + "/images/" + request.query.id+".png";
	console.log("filePath : "+filePath);
	
	fs.readFile(filePath, function(err, data) {
	  if (err)
	  	return; // Fail if the file can't be read.
	  
	  response.writeHead(200, {'content-Type' : 'image/png'})
	  response.end(data);
	});
});

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
			if ( ! error ) {
				response.json(aResult);
			} else {
				response.json("error");
			}

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