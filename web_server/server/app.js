var cors = require('cors');
var express = require('express');
var passport = require('passport');
var path = require('path');
var bodyParser = require('body-parser');

var auth = require('./routes/auth');
var index = require('./routes/index');
var news = require('./routes/news');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../client/build/'));
app.set('view engine', 'jade');
app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));

// Cross Origin Request
app.use(cors());

// Connect to DB in app.js
var config = require('./config/config.json');
require('./models/main.js').connect(config.mongoDbUri);

// load passport strategies
app.use(passport.initialize());
var localSignupStrategy = require('./passport/signup_passport');
var localLoginStrategy = require('./passport/login_passport');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authentication checker middleware
const authCheckMiddleware = require('./middleware/auth_check');
app.use('/news', authCheckMiddleware);

app.use(bodyParser.json());

app.use('/auth', auth);
app.use('/', index);
app.use('/news', news);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404 Not Found');
});

module.exports = app;
