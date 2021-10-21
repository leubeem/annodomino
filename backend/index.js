var express = require('express');
var mysql = require("mysql");
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));

// Connecting to the mysql databse on localhost
var con = mysql.createConnection({
	host: "localhost",
	user: "annodomino",
	password: "abcABC123SeCuRe",
	database: "annodomino"
});

//Implementing get features for api
app.get('/milestone', function (req,res) {
	//This query randomly selects X Rows from the table
	con.query("SELECT * FROM questions AS t1 JOIN (SELECT id FROM questions ORDER BY RAND() LIMIT 2) AS t2 ON t1.id=t2.id",
		function (err, result, fields) {
			if (err){
				//throw err;
				console.log(error);	
				res.status(503);
				res.end("Error, probably at inserting data into database");
			} else {
				//returning the rows as json
				console.log("Returning rows from databse to requester");
				res.json(result);
			}
		});
	});

//Implementing post features for api
app.post('/milestone', function(req,res) {
	//getting post body by using bodyParser
	var reqBody = req.body;

	//getting fields out of body
	const year = reqBody.year;
	const title = reqBody.title;
	const categoryId = reqBody.categoryId;

	//query to inser post values into database
	const query = `Insert into questions (year, title, category) VALUES (?,?,?);`;
	con.query(query, [year, title, categoryId], function (err, data) {
		if(err) {
			//throw err;
			console.log(error);
			res.status(503);
			res.end("Error, probably at inserting data into database");
		} else {
			//returning success and 202 OK
			console.log("Added row to database");
			res.end('Success!');
		}
	});
})

//Starting server and listening on port 8081
var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Milestone app listening on https://%s:%s", host, port)
})
