const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const https = require('https');

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'Incorrect username.'});
      }
      if (!user.validPassword(password)) {
        return done(null, false, {message: 'Incorrect password.'});
      }
      return done(null, user);
    });
  }
));

const app = module.exports = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: "cats"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(express.static(path.join(__dirname, 'www')));
app.use(fileUpload());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

// routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/member-routes'));
app.use('/', require('./routes/sponsors-routes'));
app.use('/', require('./routes/blog-routes'));
app.use('/', require('./routes/build-log-routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

const keyPath = './key.pem';
const certPath = './cert.pem';

https.createServer({
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  passphrase: '2813'
}, app).listen(3000, ()=> {
  console.log('Gear Heads Server now running on port 3000!');
});
