var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var S3 = require('./datastore.s3.js');
var apis = require('./apis.js');
var config = require('./config.json');

var app = express();
var ServerContext = {};

function startServer(){

	listenAndConfigMiddleware()
		.then(() =>{
			ServerContext = {
				s3: new S3(config),
				jsonResponse: jsonResponse,
				config: config
			};

			return ServerContext.s3.connect();
		})
		.then(()=>{
			configRoutes();
		})
		.then(()=>{
			console.log('Server Started');
		})
		.catch((err) =>{
			console.trace('startServer Error:', err);
		});
}

function listenAndConfigMiddleware(){
	return new Promise((resolve, reject) => {
		app.listen(3000, () =>{
			console.log('App Listening on Port 3000');
		});
		app.use(bodyParser.json({limit: '40mb'}));
		app.use(express.static(__dirname + '/public'));
		resolve();
	});
}

function configRoutes(){
	app.get('/', (req, res) => {
		let path = __dirname + '/public/main.html';
		res.sendFile(path);
	});
	
	let zipFiles = apis.zipFiles.bind(ServerContext);
	app.get('/zip-files/:project', zipFiles);
}

function jsonResponse(res, data, statusCode){
	var output = _.isObject(data) ? JSON.stringify(data) : data;
	if(!statusCode) {
		statusCode = 200
	};

	res.writeHead(statusCode, {
		'Content-Type': 'application/json'
	});
	res.end(output);
}

startServer();
