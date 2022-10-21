var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Tushar' });
});
router.get('/home', function (req, res, next) {
  res.render('home', { title: 'Home' });
});
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'About' });
});
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Contact' });
});
router.get('/service', function (req, res, next) {
  res.render('service', { title: 'Service' });
});
router.get('/project', function (req, res, next) {
  res.render('project', { title: 'Project' });
});
// login route
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login' });
});

// login route
router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

// register route
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register' });
});

// register route
router.post('/register', async function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  console.log('body: ', req.body);
  console.log('headers: ', req.headers);

  try {
    const user = await User.findOne({ username });

    console.log('user: ', user);

    if (user) {
      res.render('register');
    }
    const salt = await bcrypt.genSalt(10);

    console.log('salt: ', salt);

    // hash password before storing to DB
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('hashed: ', hashedPassword);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.redirect(200, '/login');
  } catch (error) {
    console.log(error);
    res.redirect(500, '/register');
  }
});

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
