var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthentication, function(req, res, next) {
  res.render('index', { title: 'Members' });
});

function ensureAuthentication(req, res, next){
  if(req.isAuthenticated())
    return next();

    res.redirect('/login'); 
}


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/Login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You\'ve successfully logged out.');
	res.redirect('/login');
})

module.exports = router;
