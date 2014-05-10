console.log('\u001b[1m');
console.log('\u001b[32m', '=============Start=============');


var fs = require('fs');
var http = require('http');
var express = require('express');
var mysql = require('mysql');

//Use Connection Pool
var pool = mysql.createPool({
	host		: '54.178.137.153',
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
					,[request.body.id, request.body.isMan, request.body.weight, request.body.language, request.body.path]
					,function(oResult) {
						
						if (oResult["affectedRows"] === 1) {
							response.send("true");	
						} else {
							response.send("false");
						}
					}
				);
			}	
		});
	});
	//response.redirect('/');
});

app.post('/getList', function(request, response) {
	
	console.log("getList / body : "+request.body);
	
	requestQuery(			
		"SELECT * FROM tbl_weight WHERE language = (SELECT language FROM tbl_weight WHERE id = ?)"
		,[request.body.id]
		,function(err, aResult) {
			if (error) {
				response.send("fail");
				return;
			}
			
			response.send(aResult);
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
			return;
		}
		
		//connection request
		connection.query(sql, function(err, queryResult) {
			
			//when error occur
			if (err) {
				console.log("Generate Sql Query Failed!!");
			}
			
			callbackFunction(err, queryResult);
		});
	});
};

//server
http.createServer(app).listen(8080, function() {
	console.log('Server running');
});

console.log('\u001b[0m');