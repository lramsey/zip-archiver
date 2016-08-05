var _ = require('lodash');
var archiver = require('archiver');
var fs = require('fs');
var path = require('path');

module.exports = {
	zipFiles: zipFiles
};

function zipFiles(req, res){
	try {
		let project = req.params.project;

		this.s3.listObjects(project)
			.then((results) =>{
				let promiseList = [];
				_.forEach(results, (value) =>{
					let key = value.Key;
					promiseList.push(getS3ObjectAndWrite.call(this, key));
				});

				return Promise.all(promiseList);
			})
			.then((results)=>{
				console.log(results);

			})
			.then(()=>{
				let data = {
					message: 'got data'
				}
				this.jsonResponse(res, data, 200);
			})
			.catch((err)=>{
				console.error('zipFiles:', err);
				let data = {
					message: 'Internal Server Error'
				};

				// let archive = createZipArchive();
				this.jsonResponse(res, data, 500);
			});
	} catch(err) {
		console.log(err);
		let data = {
			message: 'Internal Server Error'
		};

		this.jsonResponse(res, data, 500);
	}
}

function getS3ObjectAndWrite(key){
	return new Promise( (resolve, reject) =>{
		this.s3.getObject(key)
			.then((object) =>{
				var data = object.Body;

				let fileName = path.basename(key);
				let filePath = __dirname + '/data/' + fileName;

				fs.writeFile(filePath, data, (err) =>{
					if(err){
						console.error('getS3ObjectAndWrite Error:', err);
						reject(err);
					} else {
						resolve(filePath);
					}
				});
			});
	});
}

function createZipArchive(res, filePaths){
	// in progress
	let archive = archiver('zip');
	
	archive.on('error', (err) => {
    	throw err;
  	});

	//on stream closed we can end the request
	archive.on('end', () => {
		console.log('Archive wrote %d bytes', archive.pointer());
	});

	_.forEach(filePaths, (filePath)=> {
		let fileName = filePath
		archive.file(filePath, {name: fileName});
	});

	res.attachment('files.zip');

	archive.pipe(res);
	archive.finalize();

	return archive
}
