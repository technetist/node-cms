const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'home';
  next();
});

router.get('/', (req, res) => {
  Post.find({}).then(posts => {
    Category.find({}).then(categories => {
      res.render('home/index', {posts: posts, categories: categories});
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
});

router.get('/post/:id', (req, res) => {
  Post.findOne({_id: req.params.id})
    .populate({path: 'comments', match: {approval: true}, populate:{path: 'user', model:'users'}})
    .populate('user')
    .then(post => {
    Category.find({}).then(categories => {
      res.render('home/post', {post: post, categories: categories});
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
});

router.get('/login', (req, res) => {
  res.render('home/login');
});

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  User.findOne({email: email}).then((user, err) => {
    if (err) {
      return done(null, false, {err});
    }
    if (!user) {
      return done(null, false, {message: 'Incorrect username.'});
    }
    user.validPassword(password, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Incorrect password.'});
        }
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next)
});
router.post('/logout', (req, res) => {
  req.logOut();
  let r = { redirect: "/" };
  return res.json(r);
});

router.get('/register', (req, res) => {
  res.render('home/register');
});

router.post('/register', (req, res) => {
  let errors = {};
  if (!req.body.firstName) {
    errors['firstName'] = 'We need your first name.';
  }
  if (!req.body.lastName) {
    errors['lastName'] = 'We need your last name.';
  }
  if (!req.body.email) {
    errors['email'] = 'We need your email.';
  }
  if (!req.body.password) {
    errors['password'] = "You'll probably want a password...";
  }
  if (!req.body.passwordConfirm) {
    errors['passwordConfirm'] = 'You need to confirm your password.';
  }
  if (req.body.password !== req.body.passwordConfirm) {
    errors['passwordMatch'] = "Your passwords don't match.";
  }
  User.findOne({email: req.body.email}).then((user) => {
    if (user) {
      errors['emailExists'] = "That email is already registered.";
    }
  }).catch(err => console.log(err));

  if (Object.keys(errors).length > 0) {
    res.render('home/register', {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
  } else {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash;
        newUser.save().then(savedUser => {
          req.flash('success_message', `Thanks for registering, ${savedUser.firstName}!`);
          res.redirect('/login')
        }).catch(err => console.log((err)));
      });
    });
  }

});

module.exports = router;
