let jwt    = require('jsonwebtoken');
let config = require('../config/appConfig.js');
let guid = require('../classes/guid.js');
let permition = require('../classes/permission.js');

module.exports.authenticate = function authenticate(req,res,callback){
	// initialize Token  from   request
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['oz_token'];
   // check token if nullable
	if (!token){
		console.log('No token was provided');
		console.log('creating one .....');
		let visitor = {};
		let localPermition = new permition();
			localPermition.visitor = true;
		
		visitor.userGUID = guid();
		visitor.permition = localPermition;

		let newToken = jwt.sign(visitor,config.appSecret);

		//console.dir(newToken);

		req.user = visitor;
		res.set('oz_token', newToken);
		return callback();
	}

	jwt.verify(token, 'secret', verifyCallback);

  	//If verification succeds then  invoke callback,
  	//else  return  status with error
 	function verifyCallback(err, decoded) {
  		if (err){
  			
  		}  		  		
  		return callback();  		
  	}	
}