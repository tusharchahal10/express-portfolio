require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
var indexRouter = require('./routes/index');
var contactRouter = require('./routes/contacts');
const initialize = require('./passport-config');
initialize(passport);

const app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// parses incoming requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// middlewares
app.use(morgan('dev'));
app.use(flash());
app.use(
  session({
    secret: 'kwjnfu2g78393d732t9237dh238ddodeud739',
    resave: true,
    saveUninitialized: true,
  })
);
// passport middlewares
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB!'))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// global user setup
app.get('*', function (req, res, next) {
  res.locals.user = req.user;
  next();
});

// routes setup
app.use('/', indexRouter);
app.use('/contacts', contactRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(5000, () => {
  console.log(`app running on port 5000`);
});
