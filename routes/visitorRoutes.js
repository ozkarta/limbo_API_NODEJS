let express = require('express');

let router = express.Router();

router.route('/')
	.get(function(req,res,next){
		console.log(__dirname+'/dist/index.html')
		return res.sendFile('/home/ozkart/Desktop/NODEJS/limbo2/angular/dist/','index.html');
	
	});



module.exports = router;