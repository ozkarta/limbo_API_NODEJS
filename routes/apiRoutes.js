let express = require('express');
let apiRouteFunctions = require('./routeFunctions/apiRouteFunctions.js');

let router = express.Router();
//  Default Route is /api/


router.route('/employees')
	.get(apiRouteFunctions.getEmployees);

router.route('/register/employee')
	.post(apiRouteFunctions.registerEmployee);

router.route('/register/employer')
	.post(apiRouteFunctions.registerEmployer);

router.route('/logIn')
	.post(apiRouteFunctions.localLogIn);
	
router.route('/category')
	.get(apiRouteFunctions.getCategoryList);

router.route('/currency')
	.get(apiRouteFunctions.getCurrencyList);

router.route('/duration')
	.get(apiRouteFunctions.getDurationList);
router.route('/job')
	.get(apiRouteFunctions.getJobWithId);

router.route('/job/:id')
	.get(apiRouteFunctions.getJobWithId);

// Employer 
router.route('/employer/job')
	.post(apiRouteFunctions.postJob);
	
router.route('/employer/job/update')
	.post(apiRouteFunctions.updateJob);

router.route('/employer/userpostedjoblist')
	.post(apiRouteFunctions.getUserPostedJobs);

router.route('/employer/userpostedjob')
	.post(apiRouteFunctions.getUserPostedJobWithId);

router.route('/employer/searchresult')
		.post(apiRouteFunctions.getSearchResult);

router.route('/employer/offers')
	.post(apiRouteFunctions.getEmployerSpecificOffers);
	
// Employee
router.route('/employee/sendproposal')
	.post(apiRouteFunctions.sendProposal);

// Messenger
router.route('/messenger/startconversation')
	.post(apiRouteFunctions.startConversation);
//_____________________________________________________


module.exports = router;