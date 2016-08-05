var _ = require('lodash');

module.exports = {
	zipFiles: zipFiles
};

function zipFiles(req, res){
	let project = req.params.project;
	this.s3.listObjects(project)
		.then((results) =>{
			// console.log(results);
			let promiseList = [];
			_.forEach(results, (value) =>{
				let key = value.Key;
				promiseList.push(this.s3.getObject(key));
			});

			return Promise.all(promiseList);
		})
		.then((results)=>{
			console.log(results);
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

			this.jsonResponse(res, data, 500);
		});
}
