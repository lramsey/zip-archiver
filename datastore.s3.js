let aws = require('aws-sdk');
let _ = require('lodash');

function Datastore_S3(options){
	//s3 bucket config
	this.options = {
		accessKeyId: options.accessKeyId,
		secretAccessKey: options.secretAccessKey
	};
	this.s3 = null;
}

Datastore_S3.prototype.connect = function() {
	return new Promise( (resolve, reject) => {
		this.s3 = new aws.S3({
			accessKeyId: this.options.accessKeyId,
			secretAccessKey: this.options.secretAccessKey
		});

		resolve();
	});
};

Datastore_S3.prototype.listObjects = function(project) {
	return new Promise( (resolve, reject) => {
		let prefix = 'file_archiving/' + project;
		this.s3.listObjects({
			Bucket: 'coding-challenges',
			Prefix: prefix
		}, (err, data) =>{
			if(err){
				console.error('listObjects Err:', err);
				reject(err);
			} else {
				resolve(data.Contents);
			}
		});
	});
};

module.exports = Datastore_S3;
