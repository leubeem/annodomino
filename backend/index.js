var express = require('express');
var app = express();
var mysql = require("mysql");

var con = mysql.createConnection({
	host: "localhost",
	user: "annodomino",
	password: "abcABC123SeCuRe",
	database: "annodomino"
});

app.get('/milestone', function (req,res) {
		con.query("SELECT * FROM questions AS t1 JOIN (SELECT id FROM questions ORDER BY RAND() LIMIT 2) AS t2 ON t1.id=t2.id",
			function (err, result, fields) {
			if (err){
				throw err;
			} else {
				res.json(result);
			}
		});
	});

app.post('/milestone', function(req,res) {
	var reqBody = req.body;

	const year = reqBody.year;
	const title = reqBody.title;
	const categoryId = reqBosy.categoryId;

	const query = `Insert into questions (year, title, category) VAUES (?,?,?);`;
	con.query(sql, [year, title, categoryId], function (err, data) {
		if(err) {
			throw err;
		} else {
			res.end('Success!');
		}
	});
})

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Milestone app listening on https://%s:%s", host, port)
})
