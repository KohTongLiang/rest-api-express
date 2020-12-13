// imports and dependencies
var express = require('express');
var app = express();
var cors = require('cors');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
var moment = require('moment');

// import controllers
var UserController = require('./Controller/UserController');
var AuthController = require('./Controller/AuthController');
var ArticleController = require('./Controller/ArticleController');

// setup environmental variable
dotenv.config();

// setup connection to database
var db = require('./db');

// setup up scheduler
var schedule = require('./Scheduler/Scheduler');

// create a logger middlware to manipulate req/res
const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}: ${moment().format()}`);
  next();
}

// middleware
app.use(logger);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// to restrict origin
// var allowedOrigins = ['http://localhost:3000',
//                       'http://yourapp.com'];
// app.use(cors({
//   origin: function(origin, callback){
//     // allow requests with no origin 
//     // (like mobile apps or curl requests)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));

// app routes
app.use('/users', UserController);
app.use('/articles', ArticleController);
app.use('/api/auth', AuthController);

// setup port
var port = process.env.PORT || 3000;


// start the app
app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});