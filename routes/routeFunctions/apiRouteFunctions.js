let jobCategory = require('../../db/dbModules').jobCategoryModel;
let jobPost = require('../../db/dbModules').jobModel;
let User = require('../../db/dbModules').userModel;
let Duration = require('../../db/dbModules').durationModel;
let Currency = require('../../db/dbModules').currencyModel;
let Proposal = require('../../db/dbModules').proposalModel;
let Conversation = require('../../db/dbModules').conversationModel;


module.exports.getEmployees = function (req, res, next) {
	User.find({ userRole: 'employee' }, (err, result) => {
		if (err) {
			return next(err);
		}
		return res.json(result);
	});
};

module.exports.registerEmployee = function (req, res, next) {
	console.log('Employee  registration was  confirmed');

	//console.dir(req.body);
	User.findOne({ userName: req.body.employee.userName }, findWithUserNameCallback);



	function findWithUserNameCallback(err, result) {
		if (err) {
			return res.send({ status: 500, message: 'Internal Server Error' });
		}

		if (result) {
			return res.send({ status: 400, message: 'User Allready Exists' });
		}

		let newEmployee = new User();

		newEmployee.userName = req.body.employee.userName;
		newEmployee.fName = req.body.employee.fName || req.body.employee.directorFName;
		newEmployee.lName = req.body.employee.lName || req.body.employee.directorLName;
		newEmployee.email = req.body.employee.eMail
		newEmployee.passwordTrial = req.body.employee.password;
		newEmployee.employeeType = req.body.employee.employeeType;
		newEmployee.businessName = req.body.employee.businessName;
		newEmployee.controlNumber = req.body.employee.controlNumber;
		newEmployee.businessType = req.body.employee.businessType;
		newEmployee.principalOfficeAddress = req.body.employee.principalOfficeAddress;
		newEmployee.registrationDate = req.body.employee.registrationDate;  // Company Registration
		//newEmployee.fName = req.body.employee.directorFName;
		//newEmployee.lName = req.body.employee.directorLName;
		newEmployee.userRole = req.body.employee.userRole;

		newEmployee.save(afterSaveCallback);
	}
	function afterSaveCallback(err, savedUser) {
		//console.dir(savedUser);
		if (err) {
			return res.send({ status: 500, message: 'Internal Server Error' });
		}

		if (savedUser) {
			return res.send({ status: 200, message: 'User Saved' });
		} else {
			return res.send({ status: 500, message: 'User Could Not Be Saved' });
		}

	}
};

module.exports.registerEmployer = function (req, res, next) {
	console.log('it is here ');
	console.log('sending status OK');

	console.dir(req.body);

	User.findOne({ userName: req.body.employer.userName }, findWithUserNameCallback);


	//_____________________CALLBACKS______________________
	function findWithUserNameCallback(err, result) {
		if (err) {
			return res.send({ status: 500, message: 'Internal Server Error' });
		}

		if (result) {
			return res.send({ status: 400, message: 'User Allready Exists' });
		}

		let newEmployer = new User();

		newEmployer.userName = req.body.employer.userName;
		newEmployer.fName = req.body.employer.fName;
		newEmployer.lName = req.body.employer.lName;
		newEmployer.email = req.body.employer.eMail;
		newEmployer.passwordTrial = req.body.employer.password;
		newEmployer.userRole = req.body.employer.userRole;

		newEmployer.save(afterSaveCallback);
	}

	function afterSaveCallback(err, savedUser) {
		//console.dir(savedUser);
		if (err) {
			return res.send({ status: 500, message: 'Internal Server Error' });
		}

		if (savedUser) {
			return res.send({ status: 200, message: 'User Saved' });
		} else {
			return res.send({ status: 500, message: 'User Could Not Be Saved' });
		}

	}

	//res.send({status:'everything is OK'});
};

module.exports.localLogIn = function (req, res, next) {
	console.dir(req.body);

	if (req.body) {

		if (!req.body.userName) {
			return res.send({ status: 400, message: 'UserName  not valid' });
		}

		if (!req.body.password) {
			return res.send({ status: 400, message: 'Password not valid' });
		}

		User.findOne({ userName: req.body.userName, passwordTrial: req.body.password }, function userFoundCallback(err, user) {
			if (err) {
				return res.send({ status: 500, message: 'Internal Server Error' });
			}

			if (user) {
				return res.send({ status: 200, user: user });
			} else {
				return res.send({ status: 400, message: 'User was not found' });
			}
		})

	} else {
		return res.send({ status: 400, message: 'body not valid' });
	}

};

module.exports.getCategoryList = function (req, res, next) {
	jobCategory.find({ type: 'parent' })
		.populate('subCategory')
		.exec(function (err, result) {
			if (err) {
				return res.send({ statu: 500, message: 'Internal Server Error' });
			}

			return res.send({ status: 200, message: 'success', category: result });
		});
}

module.exports.postJob = function (req, res, next) {

	console.dir(req.body);
	if (req.body.newJobPost) {

		let newJobPost = new jobPost();
		newJobPost.owner = req.body.newJobPost.owner;
		newJobPost.jobCategory = req.body.newJobPost.jobCategory;
		newJobPost.jobSubCategory = req.body.newJobPost.jobSubCategory;
		newJobPost.jobTitle = req.body.newJobPost.jobTitle;
		newJobPost.jobDescription = req.body.newJobPost.jobDescription;
		newJobPost.deadLine = req.body.newJobPost.deadline;
		newJobPost.budget = req.body.newJobPost.budget;
		newJobPost.paymentType = req.body.newJobPost.paymentType;
		newJobPost.projectType = req.body.newJobPost.projectType;
		//newJobPost.status = req.body.newJobPost.status ;
		newJobPost.status = 'active';
		newJobPost.requirements = req.body.newJobPost.requirements;
		newJobPost.candidates = req.body.newJobPost.candidates;
		newJobPost.imageURLList = req.body.newJobPost.imageURLList;
		newJobPost.atachmentList = req.body.newJobPost.atachmentList;

		newJobPost.save(function (err, result) {

			if (err) {
				return res.send({ status: 500, message: 'internal server error' });
			}

			if (result) {
				return res.send({ status: 200, message: 'ok' });
			}

		});

	} else {
		return res.send({ status: 400, message: 'No Job Post Presented' });
	}

}

module.exports.updateJob = function (req, res, next) {

	console.dir(req.body);

	if (!req.body.newJobPost.id) {
		return res.send({ status: 400, message: 'Job Id is not presented' });
	}

	jobPost.findOne({ _id: req.body.newJobPost.id }, function (err, newJobPost) {
		if (err) {
			return res.send({ status: 500, message: 'internal server error' });
		}

		if (req.body.newJobPost) {

			//let newJobPost = new jobPost ();
			newJobPost.owner = req.body.newJobPost.owner;
			newJobPost.jobCategory = req.body.newJobPost.jobCategory;
			newJobPost.jobSubCategory = req.body.newJobPost.jobSubCategory;
			newJobPost.jobTitle = req.body.newJobPost.jobTitle;
			newJobPost.jobDescription = req.body.newJobPost.jobDescription;
			newJobPost.deadLine = req.body.newJobPost.deadline;
			newJobPost.budget = req.body.newJobPost.budget;
			newJobPost.paymentType = req.body.newJobPost.paymentType;
			newJobPost.projectType = req.body.newJobPost.projectType;
			//newJobPost.status = req.body.newJobPost.status ;
			newJobPost.status = 'active';
			newJobPost.requirements = req.body.newJobPost.requirements;
			newJobPost.candidates = req.body.newJobPost.candidates;
			newJobPost.imageURLList = req.body.newJobPost.imageURLList;
			newJobPost.atachmentList = req.body.newJobPost.atachmentList;

			//console.dir(newJobPost);


			newJobPost.save(function (err1, result) {

				if (err1) {
					return res.send({ status: 500, message: 'internal server error' });
				}

				if (result) {
					return res.send({ status: 200, message: 'ok', post: result });
				}

			});

			// return res.send({status:200,message:'ok',post:newJobPost});

		} else {
			return res.send({ status: 400, message: 'No Job Post Presented' });
		}

	});


}

module.exports.getUserPostedJobs = function (req, res, next) {

	//console.dir(req.body);


	if (!req.body.owner) {
		return res.send({ status: 400, message: 'no user presented' });
	}

	jobPost.find({ owner: req.body.owner }, function (err, result) {

		if (err) {
			return res.send({ status: 500, message: 'Internal Server Error' });
		}
		//console.dir(result);

		return res.send({ status: 200, message: 'ok', PostList: result });

	});
}

module.exports.getUserPostedJobWithId = function (req, res, next) {
	//console.dir(req.body);


	if (!req.body.owner) {
		return res.send({ status: 400, message: 'no user presented' });
	}

	if (!req.body.jobID) {
		return res.send({ status: 400, message: 'no ID presented' });
	}

	jobPost.find({ owner: req.body.owner, _id: req.body.jobID })
		.populate('')
		.exec(function (err, result) {

			if (err) {
				return res.send({ status: 500, message: 'Internal Server Error' });
			}
			//console.dir(result);

			return res.send({ status: 200, message: 'ok', PostList: result });

		});
}

module.exports.getSearchResult = function (req, res, next) {

	console.log('we have to find .....');
	console.dir(req.body);

	if (req.body.search) {
		let keyWordLikeRegExps;
		let searchQuery = {};
		let queryArray = [{}];

		let maxPostQuant = 10;
		let currentPage = 0;

		searchQuery.$or = [];

		if (req.body.search.searchString.trim()) {
			keyWordLikeRegExps = [new RegExp('^.* ' + req.body.search.searchString.trim() + ' .*$', 'gi'),
			new RegExp('^' + req.body.search.searchString.trim() + ' .*$', 'gi'),
			new RegExp('^.* ' + req.body.search.searchString.trim() + '$', 'gi'),
			new RegExp('^' + req.body.search.searchString.trim() + '.*$', 'gi'),
			new RegExp('^.*' + req.body.search.searchString.trim() + '$', 'gi'),
			new RegExp('^.*' + req.body.search.searchString.trim() + '.*$', 'gi')
			];
			console.dir(keyWordLikeRegExps);
		}

		//  generate  search queryArray
		if (req.body.search.category) {
			if (req.body.search.subCategory) {
				if (req.body.search.searchString.trim()) {
					// Level 1
					(searchQuery.$or).push({
						$and: [
							{ jobCategory: req.body.search.category },
							{ jobSubCategory: req.body.search.subCategory },
							{
								jobTitle:
								{ $in: keyWordLikeRegExps }
							}
						]
					});
					// Level 2

					(searchQuery.$or).push({
						$and: [
							{ jobCategory: req.body.search.category },
							{
								jobTitle:
								{ $in: keyWordLikeRegExps }
							}
						]
					});


					// Level 3


					(searchQuery.$or).push({
						$and: [
							{ jobCategory: req.body.search.category },
							{ jobSubCategory: req.body.search.subCategory }
						]
					});


					// Level 4
					(searchQuery.$or).push({
						$and: [
							{ jobCategory: req.body.search.category }
						]
					});
					// Level 5
					(searchQuery.$or).push({
						$and: [
							{
								jobTitle:
								{ $in: keyWordLikeRegExps }
							}
						]
					});
				} else {
					// Level 2
					(searchQuery.$or).push({
						$and: [
							{ jobCategory: req.body.search.category },
							{ jobSubCategory: req.body.search.subCategory }
						]
					});
					// Level 3
					(searchQuery.$or).push({
						$and: [
							{ jobCategory: req.body.search.category }
						]
					});

				}

			} else {

				if (req.body.search.searchString.trim()) {
					// Level 2
					(searchQuery.$or).push({
						$and: [
							{ jobCategory: req.body.search.category },
							{
								jobTitle:
								{ $in: keyWordLikeRegExps }
							}
						]
					});
				}

				// Level 3
				(searchQuery.$or).push({
					$and: [
						{ jobCategory: req.body.search.category }
					]
				});
				if (req.body.search.searchString.trim()) {
					// Level 5
					(searchQuery.$or).push({
						$and: [
							{
								jobTitle:
								{ $in: keyWordLikeRegExps }
							}
						]
					});
				}

			}
		} else {
			if (req.body.search.searchString.trim()) {
				// Level 5
				(searchQuery.$or).push({
					$and: [
						{
							jobTitle:
							{ $in: keyWordLikeRegExps }
						}
					]
				});
			} else {
				(searchQuery.$or).push({
					$and: [
						{
						}
					]
				});
			}
		}

		if (searchQuery.$or) {
			queryArray = searchQuery.$or;
		}

		console.log('____________________Search Query___________');
		console.dir(JSON.stringify(queryArray));
		console.log('_____________________________________');
		cyncronisedExecuteFindQuery(jobPost, queryArray, 0, [], function (searchResult) {

			//console.dir(searchResult);

			res.send({ status: 200, message: 'success', searchResult: searchResult });


		});


	} else {
		return res.send({ status: 400, message: 'search parameter not supplied' });
	}
}


module.exports.getCurrencyList = function(req, res, next){
	Currency.find({}, function(err,result){
		if (err){
			return res.send({status:'500',message:'Internal Server Error'});
		}
		return res.send({status:'200',message:'ok',currency:result});
	});
}

module.exports.getDurationList = function(req, res, next){
	Duration.find({}, function(err, result){
		if (err){
			return res.send({status:'500',message:'Internal Server Error'});
		}
		return res.send({status:'200',message:'ok',duration:result});
	});
}

module.exports.getJobWithId = function(req, res, next){
	console.log(req);
	let id = '';
	if (req.params.id){
		id = req.params.id;
	}
	if (req.query.id){
		id = req.query.id;
	}
	if (id){
		jobPost.findOne({_id:id})
				.populate('proposals')
				.exec(function(err,result){
						if(err){
							return res.send({status:'500',message:'internal server error'});
						}
						return res.send({status:200,message:'ok',result:result});
					});
	}else{
		return res.send({status:'400',message:'ID is not provided'});
	}
	
	
}


module.exports.sendProposal = function(req, res, next){
	console.dir(req.body);
	


	if (!req.body){
		return res.send({status:400,message:'No Body presented'});
	}
	if (!req.body.proposal){
		return res.send({status:400,message:'No Body presented'});
	}else{
		jobPost.findOne({_id:req.body.proposal.hostJobID}, jobSearchCallback)
	}

	function jobSearchCallback(err,job){
		if(err){
			return res.send({status:'500',message:'Internal Server Error'});
		}
		if(job){
			let proposal = new Proposal();
			proposal.candidate = req.body.proposal.candidate.id;
			proposal.price = req.body.proposal.price;
			proposal.currency = req.body.proposal.currency;
			proposal.duration = req.body.proposal.duration;
			proposal.coverLetter = req.body.proposal.coverLetter;
			proposal.whyToChoose = req.body.proposal.whyToChoose;
			proposal.offerStatus = req.body.proposal.offerStatus;

			proposal.save(function(err,proposalSaved){
				console.dir(err);
				if(proposalSaved){
					job.proposals.push(proposalSaved)
					job.save(function(err,jobSaved){
						console.dir(err);
						if(jobSaved){
							return res.send({status:200,message:'proposal saved'});
						}else{
							return res.send({status:500,message:'internal server error'});
						}
					})
				}else{
					return res.send({status:500,message:'internal server error'});
				}
			})
		}else{
			res.send({status:400,message:'parameters  not correct'});
		}
	}




}


module.exports.getEmployerSpecificOffers = function(req, res, next){
	console.dir(req.body);

	if (!req.body){
		return res.send({status:400,message:'User Not presented'});
		next();
	}

	if (!req.body.user){
			return res.send({status:400,message:'User Not presented'});
			next();
	}

	if (req.body.user){
		jobPost.find({owner:req.body.user._id})
				.populate({
					path:'proposals',
					model:'Proposal',
					populate: [
					{
						path:'candidate',
						model:'User'
					},
					{
						path: 'currency',
						model: 'Currency',
					},
					{
						path: 'duration',
						model: 'Duration'
					}
					]
				})
				.exec(function (err, result){
					if (err){
						return res.send({status:500,message:'Internal Server Error'});
					}else{


						return res.send({status:200,message:'OK',result:result});
					}
				});
	}



	
}

module.exports.startConversation = function(req, res, next){
	console.dir(req.body);
	console.log('conversation started....');

	let sender;
	let candidate;
	let subjectJob;
	if (!req.body){
		return res.send({status:400,message:'body not presented'});
	}

	if (!req.body.candidate){
		return res.send({status:400,message:'body not presented'});
	}else{
		candidate = req.body.candidate;
	}

	if (!req.body.subjectJob){
		return res.send({status:400,message:'body not presented'});
	}else{
		subjectJob = req.body.subjectJob;
	}

	if (!req.body.sender){
		return res.send({status:400,message:'body not presented'});
	}else{
		sender = req.body.sender;
	}


	Conversation.findOne({$and:[{subject:subjectJob},{$and:[{chatters:sender},{chatters:candidate}]} ]}, function conversationLoookup(err, conversation){
		if(err){
			return res.send({status:500,message:'internal server error'});
		}else{
			if (conversation){
				console.log('conversation exists....');
				console.dir(conversation);

				return res.send({status:200,message:'ok',conversation:{conversationId:conversation.id}});
			}else{
				console.log('creating new conversation...');
				let newConversation = new Conversation();
				newConversation.chatters.push(sender);
				newConversation.chatters.push(candidate);
				newConversation.subject = subjectJob;

				newConversation.save(function saveConversation(err, savedConversation){
					console.dir(savedConversation);
					return res.send({status:200,message:'ok',conversation:{conversationId:savedConversation.id}});
				})
			}
			
		}
	});


}


//_______________________________HELPERS_____________________________
function cyncronisedExecuteFindQuery(finder, queryArray, index, capacitor, callback) {

	console.log('logging index ' + index);
	if (index < queryArray.length) {
		finder.find(queryArray[index], function (err, result) {
			if (!err) {
				//console.dir(queryArray[index]);
				console.log(' was executed succesfully');
				capacitor = capacitor.concat(result);
				index++;

				console.log('calling next tick');
				cyncronisedExecuteFindQuery(finder, queryArray, index, capacitor, callback);
			} else {
				//console.log('error');
				index++;
				cyncronisedExecuteFindQuery(finder, queryArray, index, capacitor, callback);
			}
		});
	} else {
		callback(capacitor);
	}
}