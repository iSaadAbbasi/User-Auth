
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../dbs/User.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});
router.post('/registration', upload.single('avatar'), function (req, res, next) {
	console.log(req.body || 'EMPTY BODY');
	console.log(req.file || 'no file found');

	var username = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var cPassword = req.body.cPassword;
	if (req.file) {
		var mimetype = req.file.mimetype;
		var filename = req.file.filename;
		var path = req.file.path;
		var size = req.file.size;
		var originalname = req.file.originalname;
		var dest = req.file.destination;
	}



	req.checkBody('name', 'username field should not be empty!').notEmpty();
	req.checkBody('email', 'email field should not be empty!').notEmpty();
	req.checkBody('email', 'invalid email format').isEmail();
	req.checkBody('password', 'password field should not be empty').notEmpty();
	req.checkBody('cPassword', 'Cannot match passwords').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		console.log('ERRORS at validation');
		res.render('register', {
			errors: errors,
			username: username,
			email: email,
			password: password,
			cPassword: cPassword
		})
	} else {
		console.log('NO ERROR');
		var newUser = new User({
			username: username,
			email: email,
			password: password,
			filename: filename,
			originalname: originalname
		})
		// console.log('details going to be saved', newUser);
		// newUser.save(function(err){
		// 	if(err) throw err;
		// 	console.log('Saved');
		// })
		User.createUser(newUser);

		req.flash('success', 'You are now registered and may login');
		res.location('/');
		res.redirect('/');
	}
	console.log('registration called.')
})

passport.serializeUser(function (user, done) {
	done(null, user.id);
})
passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		if (err) throw err;
		done(null, user);
	})
})
passport.use(new LocalStrategy({ usernameField: 'email' },
	function (email, password, done) {
		User.findByEmail(email, function (err, user) {
			console.log('user found: ', user);
			if (err) console.log(err);
			// if (user) return done(null, user);
			if (!user) {
				console.log('no user found')
				return done(null, false, { message: 'No User Found' });
			}
			User.comparePasswords(password, user.password, function (err, matched) {
				if (err) throw err;
				if (matched) done(null, user);
				else done(null, false, { message: 'No Password Match' });
			})
		});

	}))
router.post('/login', passport.authenticate('local',
	{
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: 'Invalid username or password'
	}), function (req, res) {
		console.log('authentication successful');
		req.flash('success', 'You\'ve successfully logged in.');
		res.redirect('/');

	})


module.exports = router;
