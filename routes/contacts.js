var express = require('express');
const Contact = require('../models/Contact');
var router = express.Router();

// get contacts page with all contacts
router.get('/', async (req, res) => {
  if (req.user) {
    const contacts = await Contact.find()
      .collation({ locale: 'en', strength: 2 })
      .sort({ name: 1 });

    res.render('contacts', { title: 'Contact', contacts: contacts });
  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});

// add contact
router.post('/', async (req, res) => {
  try {
    new Contact(req.body).save();
    req.flash('success', 'contact added');
    res.redirect('/contacts');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/contacts');
  }
});

// add contact page
router.get('/add', (req, res) => {
  if (req.user) {
    res.render('add_contact', { title: 'Add Contact' });
  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});

// update contact page
router.get('/update/:id', async (req, res) => {
  if (req.user) {
    try {
      const contact = await Contact.findById(req.params.id);
      res.render('update_contact', {
        title: 'Update Contact',
        contact: contact,
      });
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/contacts');
    }
  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});

// update contact
router.post('/update/:id', async (req, res) => {
  if (req.user) {
    try {
      await Contact.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.redirect('/contacts');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/contacts');
    }
  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});

// delete contact
router.get('/delete/:id', async (req, res) => {
  if (req.user) {
    try {
      await Contact.findByIdAndDelete(req.params.id);

      res.redirect('/contacts');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/contacts');
    }
  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});

module.exports = router;
