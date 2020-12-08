// imports and dependencies
var express = require('express');
var app = express();
const dotenv = require('dotenv');
var bodyParser = require('body-parser');

// import controllers
var UserController = require('./Controller/UserController');
var AuthController = require('./Controller/AuthController');

// setup environmental variable
dotenv.config();

// setup connection to database
var db = require('./db');

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//
app.use('/users', UserController);
app.use('/api/auth', AuthController);

// setup port
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});