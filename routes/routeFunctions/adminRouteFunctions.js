let jobCategory = require('../../db/dbModules').jobCategoryModel;
let jobPost = require('../../db/dbModules').jobModel;
let User = require('../../db/dbModules').userModel;


module.exports.getEmployees = function(req,res,next){
	User.find({userRole:'employee'}, (err,result) =>{
		if (err){
			return  next(err);
		}
		return res.json(result);
	});
};