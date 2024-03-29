var express = require('express');
var router = express.Router();
const request = require('request');
var session = require('express-session');

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (!req.session.user && !req.cookies.user_sid) {
        res.redirect('/');
    } else {
        next();
    }    
};

/* GET main dashboard. */
router.get('/', function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
		var user_data = JSON.parse(req.session.user);
        res.render('dashboard', { title: 'scibuildr', username: user_data.name });
    } else {
        res.redirect('/');
    }	
});

// route for user signup
router.get('/signup', sessionChecker, (req, res) => {
	res.send('this would be the signup page');
});

// route for user authentication
router.get('/authenticate', function(req, res, next) {
	request('https://oauth2.googleapis.com/tokeninfo?id_token=' + req.query.idtoken, (err, resp, body) => {
	  if (err) { return console.log(err); }
	  req.session.user = resp.body;
      res.redirect('/dashboard');
	});
});

//route for user logout
router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

//route for myprofile
router.get('/myprofile', sessionChecker, (req, res) => {
	var user_data = JSON.parse(req.session.user);
	console.log(user_data);
    res.render('profile', { title: 'scibuildr', 
    						username: user_data.name,
    						name: user_data.name,
    						email: user_data.email,
    						picture: user_data.picture});

});

router.get('/settings', sessionChecker, (req, res) => {
	var user_data = JSON.parse(req.session.user);
    res.render('settings', { title: 'scibuildr', username: user_data.name });
});

module.exports = router;
