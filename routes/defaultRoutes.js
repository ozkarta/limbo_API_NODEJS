let express = require('express');
let auth = require('../classes/authentication.js');

let router = express.Router();

router.route('/')
	.get( function(req,res,next){
		auth.authenticate(req, res, () =>{
			console.dir(res._headers['oz_token']);
			console.log('_____________________');
			console.dir(req.user);
			
			if ( req.user.permition.visitor){
				res.redirect('/visitor');
			}

			if ( req.user.permition.employee){

			}

			if ( req.user.permition.employer){

			}

			if ( req.user.permition.administration){

			}
		});
	});





module.exports = router;