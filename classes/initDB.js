let jobCategory = require('../db/dbModules').jobCategoryModel;
let jobPost = require('../db/dbModules').jobModel;
let User = require('../db/dbModules').userModel;

let Proposal = require('../db/dbModules').proposalModel;
let Currency = require('../db/dbModules').currencyModel;
let Duration = require('../db/dbModules').durationModel;
let OfferStatus = require('../db/dbModules').offerStatusModel;

module.exports.initDatabase = function(){

	initJobCategory();
	indipendentInit();
}


//____________________________JOB CATEGORY_____________________
function initJobCategory(){

	jobCategory.find({},function(err,result){
		
			


			if(result.length === 0 ){
				if(!err){
					let categoryArray = [];

					let idSaver=[];
					let arr = [{sub:'სახლი'},{sub:'outdoor'},{sub:'avto/moto'},{sub:'eleqtro teqnika'},{par:'xeloba/sheketeba'}];
					
					syncSaveCategory(arr,idSaver,0,arr.length,()=>{
						idSaver = [];
						arr = [{sub:'ავტო ტრანსპორტირება'},{sub:'საშენი მასალა'},{sub:'საკვები პროდუქტი'},{sub:'ნარჩენების გატანა/გადაზიდვა'},{sub:'სახლის ტექნიკის/ავეჯის ტრანსპორტირება'},{sub:'ადამიანების ტრანსპორტირება'},{par:'გადაზიდვა'}]

						syncSaveCategory(arr,idSaver,0,arr.length,()=>{
							idSaver = [];
							arr = [{sub:'საშენი მასალა'},{sub:'საკვები პროდუქცია'},{sub:'თამბაქო'},{sub:'ალკოჰოლი'},{sub:'საავტომობილოო ნაწილები'},{sub:'ელექტრო ტექნიკა'},{par:'წარმოება / საწყობი'}]

							syncSaveCategory(arr,idSaver,0,arr.length,()=>{
								idSaver = [];
								arr = [{sub:'მუშა'},{sub:'ინფორმაციული ტექნოლოგიები'},{sub:'ეკონომისტი'},{sub:'მენეჯმენტი'},{sub:'მარკეტინგი'},
										{sub:'გაყიდვები'},{sub:'იურიდიული'},{sub:'სასტუმრო/რესტორანი/კვება'},{sub:'ჯანდაცვა'},{sub:'დაცვა/უსაფრთხოება'},
										{sub:'ელექტრო ინჟინერია'},{sub:'ტურიზმი'},{sub:'დიზაინი'},{sub:'განათლება'},{sub:'სპორტი'},{par:'Human Resourses'}]
								syncSaveCategory(arr,idSaver,0,arr.length,()=>{
									idSaver = [];
									arr = [{sub:'უსაფრთხოების სისტემები'},{sub:'ქსელური მოწყობილობები'},{sub:'გათბობიბ სისტემები'},
									{sub:'ვენტილაციის სისტემები'},{sub:'საირიგაციო სისტემები'},{par:'მონტაჟი'}]

									syncSaveCategory(arr,idSaver,0,arr.length,()=>{
										initUserAndJobPost();
									});
								});
							});
						});
					});

			}

			


			


			


			}		
	});
	
}

function syncSaveCategory(array,idSaver,start,end,callback){
	if (start<end){
		if (array[start].sub){
			let child = createToJobCategory(array[start].sub,'child');
			child.save((err,res)=>{
				idSaver.push(res._id);
				return syncSaveCategory(array,idSaver,start+1,end,callback);
			});
		}
		if(array[start].par){
			console.log('calling back because .... '+array[start].par);

			let parent = createToJobCategory(array[start].par,'parent');
			for (let i=0; i<idSaver.length; i++){
				parent.subCategory.push(idSaver[i]);

				
			}
			parent.save((err,res) =>{
					if(res){
						//console.log('parent saved )))');
						return callback();
					}
				});
		}
	}else{
		return callback();
		return null;
	}
}



function createToJobCategory(categoryVarName,type){
	var cat=new jobCategory();
	//cat.categoryGUID=guid();
	cat.categoryVarName=categoryVarName;
	cat.subCategory=[];
	cat.type=type;
	// cat.save(function(err,savedResult){
	// 	console.log('Category _'+categoryVarName+'_  was added');
	// })
	return cat;
}
//______________________________________________________________

//_____________________________USER_____________________________

function initUserAndJobPost(){
	User.find({},(err,res1) =>{
		if(res1.length == 0){
			jobPost.find({},(err2,res2) =>{
				if(res2.length == 0 ){
					// Add Employers
					let user = new User();
					user.userRole = 'employer';
					user.passwordTrial = '12qwert12';
					user.userName = 'employer1';

					user.email = 'ozbegi1@gmail.com';
					user.contactPhone = '+995 568 208 075';
					user.fName = 'ოზბეგი';
					user.lName = 'ქართველიშვილი';

					user.save((err,employer) =>{
						console.log('employer added');
						console.log('userName:  '+employer.userName);
						console.log('Password:  '+employer.passwordTrial);


						let jobDescription = 'სახლის გარემონტება მინდა, დაახლოებით 100 კვ მეტრი ფართობი, ძაან კარგი რემონტით';

						initJobPost(employer,'სახლის რემონტი',jobDescription,new Date(2017,12,30),'2000 $','Fixed', 'One Time','xeloba/sheketeba','' )

					});


					user = new User();
					user.userRole = 'employer';
					user.passwordTrial = '12qwert12';
					user.userName = 'employer2';

					user.email = 'ozbegi1@gmail.com';
					user.contactPhone = '+995 598 260 802';
					user.fName = 'ირაკლი';
					user.lName = 'ქართველიშვილი';

					user.save((err,employer) =>{
						console.log('employer added');
						console.log('userName:  '+employer.userName);
						console.log('Password:  '+employer.passwordTrial);

						let jobDescription = 'სახლი გავყიდე თბილისში და გადავდივარ რაიონში, მინდა გადავიტანო არსებული ჭურჭელი, ავეჯი, ჭიათურაში, დაახლოებით 180 კმ ია მანძილი, შემომთავაზეთ გადაზიდვის საფასური.';

						initJobPost(employer,'ავეჯის გადატანა',jobDescription,new Date(2017,1,30),'400 $','Fixed', 'One Time','გადაზიდვა','' )

					});


					// Add Employees

					user = new User();
					user.userRole = 'employee';
					user.passwordTrial = '12qwert12';
					user.userName = 'employee1';

					user.email = 'ozbegi1@gmail.com';
					user.contactPhone = '+995 598 912 900';
					user.fName = 'ირაკლი';
					user.lName = 'ასანიძე';

					user.save((err,employer) =>{
						console.log('employer added');
						console.log('userName:  '+employer.userName);
						console.log('Password:  '+employer.passwordTrial);
					});

					user = new User();
					user.userRole = 'employee';
					user.passwordTrial = '12qwert12';
					user.userName = 'employee2';

					user.email = 'ozbegi1@gmail.com';
					user.contactPhone = '+995 551 445 441';
					user.fName = 'გიორგი';
					user.lName = 'ცუცქირიძე';

					user.save((err,employer) =>{
						console.log('employer added');
						console.log('userName:  '+employer.userName);
						console.log('Password:  '+employer.passwordTrial);
					});
				}
			})
		}

		

	});
	

}

function initJobPost(user,title,description,deadLine,budget,paymentType,projectType,categoryName,subCategoryName){
	let job = new jobPost();
	job.owner = user;
	job.jobTitle = title;
	job.jobDescription = description;
	job.deadLine = deadLine;
	job.budget = budget;
	job.paymentType = paymentType;
	job.projectType = projectType;
	job.status = 'active';

	jobCategory.findOne({categoryVarName:categoryName},function(err,cat){
		job.jobCategory = cat;

		job.save((err,saved)=>{
			if(saved){
				console.log('job was saved');
			}
		});
	});
}

//______________________________________________________________
function indipendentInit(){
	Currency.find({}, function(err,res){
		if(res.ength === 0){
			
				let cur = new Currency();
				cur.country = 'Georgia';
				cur.currency = 'Gel';
				cur.currencySymbol = '';

				cur.save(function(){
					console.log('currency added')
				});

				let cur2 = new Currency();
				cur2.country = 'EU';
				cur2.currency = 'EUR';
				cur2.currencySymbol = '';

				cur2.save(function(){
					console.log('currency added')
				});

				let cur3 = new Currency();
				cur3.country = 'USA';
				cur3.currency = 'USD';
				cur3.currencySymbol = '';

				cur3.save(function(){
					console.log('currency added')
				});
				
		}
	});
	


	Duration.find({},function(err,res){
		if(res.length === 0){
			//_________________________
			let dur1 = new Duration();
			dur1.duration = '1 Week';
			dur1.durationValue = '1';

			dur1.save(function(err2,saved){
				console.log('duration added');
			});
			//_________________________
			let dur2 = new Duration();
			dur2.duration = '2 Weeks';
			dur2.durationValue = '2';

			dur2.save(function(err2,saved){
				console.log('duration added');
			});
			//_________________________
			let dur3 = new Duration();
			dur3.duration = '1 Month';
			dur3.durationValue = '4';

			dur3.save(function(err2,saved){
				console.log('duration added');
			});
			//_________________________
			let dur4 = new Duration();
			dur4.duration = '6 months';
			dur4.durationValue = '24';

			dur4.save(function(err2,saved){
				console.log('duration added');			
			});
		}
	});


	OfferStatus.find({},function(err,result){
		
		if (result.length == 0) {
			OfferStatus.remove({},function(err1,res1){
				let stat1 = new OfferStatus();
				stat1.status = 'proposed';
				stat1.statusValue = '1';

				let stat2 = new OfferStatus();
				stat2.status = 'declined';
				stat2.statusValue = '2';

				let stat3 = new OfferStatus();
				stat3.status = 'interviewing';
				stat3.statusValue = '3';

				let stat4 = new OfferStatus();
				stat4.status = 'accepted';
				stat4.statusValue = '4';

				stat1.save(function(err,res){
					console.log('Offer Status saved');
				});
				stat2.save(function(err,res){
					console.log('Offer Status saved');
				});
				stat3.save(function(err,res){
					console.log('Offer Status saved');
				});
				stat4.save(function(err,res){
					console.log('Offer Status saved');
				});


			})
		}
	})
}


