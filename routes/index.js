var express = require('express');
var router = express.Router();

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
module.exports = router;
