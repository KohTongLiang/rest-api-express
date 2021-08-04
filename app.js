// imports and dependencies
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const moment = require('moment')
const passport = require('passport')
const cookieParser = require('cookie-parser')

// check node environment
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

// import controllers and strategies
const UserController = require('./Controller/UserController');
const AuthController = require('./Controller/AuthController');
const ArticleController = require('./Controller/ArticleController');
require('./Strategies/JwtStrategy')
require('./Strategies/LocalStrategy')
require('./Auth/Authenticate')

// setup connection to database
const db = require('./db');

// setup up scheduler
const schedule = require('./Scheduler/Scheduler');

// create a logger middlware to manipulate req/res
const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}: ${moment().format()}`);
  next();
}

// middleware
app.use(logger);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup white list and cors options
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))
//app.use(cors())
app.use(passport.initialize())
app.use(cookieParser("secret"));

// app routes
app.use('/users', UserController);
app.use('/articles', ArticleController);
app.use('/auth', AuthController);

// setup port
var port = process.env.PORT || 5000;


// start the app
app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});