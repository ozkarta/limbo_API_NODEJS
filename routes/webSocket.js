let jobCategory = require('../db/dbModules').jobCategoryModel;
let jobPost = require('../db/dbModules').jobModel;
let User = require('../db/dbModules').userModel;
let Conversation = require('../db/dbModules').conversationModel;
let Message = require('../db/dbModules').messageModel;

let url = require('url');
let WS_USER_ARRAY = [];

module.exports.webSocketHandler = function (ws){
	console.log('Client connected');
	
	let location = url.parse(ws.upgradeReq.url, true);
	//console.dir(location);

	let userToken = location.query.token;
	console.log(userToken);

	//  Push  new user  to array when connected
	WS_USER_ARRAY.push(
			{
				token:userToken,
				userId:userToken,
				ws:ws
			}
		);
//console.dir(WS_USER_ARRAY);


	ws.send(JSON.stringify({conversation:{},type:'handshake',status:200,message:'hello client'}));


	ws.on('close', function close() {
		  console.log('___________________disconnected');

		  for(let i = WS_USER_ARRAY.length-1 ; i>=0; i--){
		  		if(WS_USER_ARRAY[i].ws.readyState === WS_USER_ARRAY[i].ws.CLOSED){
		  			console.log('OFFLINE USER');
		  			WS_USER_ARRAY.splice(i,1);
		  		}
		  }
	});

	ws.on('message',function incomming(messageString){
		console.log('message received ....');
		
		

		let message = JSON.parse(messageString);
		


		//  Get Conversation List
		if (message.type==='GetConversationList'){
			Conversation.find({chatters:message.sender})
				.populate([{
							path:'chatters',
							model:'User'
						},{
							path:'subject',
							model:'Jobs',
						},{
							path:'message',
							model:'Message'
						}
				])
				.exec(function(err, conversationList){
						let response={};
						if(err){
							response.status='500';
							response.message='internal server error';
							response.type='err';
						}else{
							response.status='200';
							response.message='ok';
							response.data=conversationList;
							response.dataType = 'ConversationList';
							response.type='GET';

						}
						ws.send(JSON.stringify(response));
					});
		}

		//  Add new message to conversation

		if (message.type === 'NewMessage'){

			let messageJSON = message.data[0];

			let newMessage = new Message();
			newMessage.sender = messageJSON.senderId;
			newMessage.text = messageJSON.text;

			newMessage.save(function(err,savedMessage){
				Message.populate(savedMessage,[{path:'sender',model:'User'},{path:'seenBy',model:'User'}],function(err,populated){
					if(err){
						let response={};
						response.status='500';
						response.message='internal server error';
						response.type='err';

						ws.send(JSON.stringify(response));

					}else{
						Conversation.findOne({_id:messageJSON.conversationId,subject:messageJSON.subjectId}, function(err,conversation){
					
							if(err){
								let response={};
								response.status='500';
								response.message='internal server error';
								response.type='err';

								ws.send(JSON.stringify(response));

							}else{
								conversation.message.push(populated);
								conversation.save(function(err,savedConversation){
										if(err){
											let response={};
											response.status='500';
											response.message='internal server error';
											response.type='err';

											ws.send(JSON.stringify(response));

										}else{
											let response={};
											response.status = '200';
											response.message ='ok';
											response.data = [
												{
													conversationId : messageJSON.conversationId,
													subjectId : messageJSON.subjectId,
													message : populated
												}
											];
											response.dataType = 'UpdateMessage';
											response.type ='UpdateMessage';

											//ws.send(JSON.stringify(response));
											let users = [];
											//console.dir(savedConversation.chatters);
											for(let user of savedConversation.chatters){
												console.log(user.toString());
												users.push(user.toString());
											}
											console.log('ready to send to ...');
											console.dir(users);
											sendToAllActiveUsers(users,JSON.stringify(response));
										}							

								});
							}
						})
					}
				})
				
				
			});
		}

		

	});

	// ws.on('close', function close(message){
	// 	console.log('closed');
	// });

	// ws.on('open', function open(message){
	// 	console.log('open');
	// });

}

function sendToAllActiveUsers(userIdArray,responseString){
	for (let user of WS_USER_ARRAY){

		for(let u of userIdArray ){
			if (u === user.userId){
				if (user.ws.readyState === user.ws.OPEN){
					user.ws.send(responseString);
				}
			}
		}


		
	}
}