let aws = require('aws-sdk');
let _ = require('lodash');

function Datastore_S3(options){
	//s3 bucket config
	this.options = {
		accessKeyId: options.accessKeyId,
		secretAccesKey: options.secretAccesKey
	};
}

Datastore_S3.prototype.connect = function() {
	return new Promise( (resolve, reject) => {
		this.s3 = new aws.S3({
			accessKeyId: this.options.accessKeyId,
			secretAccesKey: this.options.secretAccesKey
		});

		resolve();
	});
};

module.exports = Datastore_S3;
