module.exports.visitorErrorHandler = function visitorErrorHandler(err,req,res,next){
	if(err){
		console.dir(err);
		return res.sendStatus(500);
	}
}

module.exports.adminErrorHandler = function adminErrorHandler(err,req,res,next){
	if(err){
		console.dir(err);
		return res.sendStatus(500);
	}
}

module.exports.employeeErrorHandler = function employeeErrorHandler(err,req,res,next){
	if(err){
		console.dir(err);
		return res.sendStatus(500);
	}
}

module.exports.employerErrorHandler = function employerErrorHandler(err,req,res,next){
	if(err){
		console.dir(err);
		return res.sendStatus(500);
	}
}

module.exports.apiErrorHandler = function apiErrorHandler(err,req,res,next){
	if(err){
		console.dir(err);
		return res.sendStatus(500);
	}
}

module.exports.urlNotFoundHandler =  function(req,res,next){
	
	//console.log(req.baseURL);
	//return next(new Error());
	next('404 Page not found');
	
}