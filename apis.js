var _ = require('lodash');

module.exports = {
	zipFiles: zipFiles
};

function zipFiles(req, res){
	let project = req.params.project;
	this.s3.listObjects(project)
		.then((data)=>{
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
