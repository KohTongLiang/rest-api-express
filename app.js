// imports and dependencies
var express = require('express');
var app = express();
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