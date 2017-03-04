//  Global
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let path = require('path');

let ws = require('ws');


let apiRouter = require('./routes/apiRoutes.js');
let webSocketHandler = require('./routes/webSocket.js').webSocketHandler;

let initDB = require('./classes/initDB');

//   Locals
let config = require('./config/appConfig.js');
let logger = require('./classes/logger.js');
let errorHandlers = require('./classes/errorHandlers.js');


//  App
let app = express();
let WebSocketServer = ws.Server;




app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//  Enable cors For  API functions
app.use('/api', function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

//  Main Routes


app.use('/api', apiRouter);




app.use('*',errorHandlers.urlNotFoundHandler);


// Detault Error Logger to the file
app.use(logger.errorLogger);

// Error Handlers

app.use('/api', errorHandlers.apiErrorHandler);





//  mongoose connection
mongoose.connect(process.env.MONGODB_URI || config.dbURL);

let port = config.port ;

let server = app.listen(port, () =>{
	console.log('Limbo app is listening to ... ' +port);

	initDB.initDatabase();
});

//											WS
//  ______________________________________________________________________________________________
let wss =new WebSocketServer({ server: server });

wss.on('connection', webSocketHandler);