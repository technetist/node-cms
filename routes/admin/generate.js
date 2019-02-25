const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const express = require('express');
const router = express.Router();
const {userAuthenticated} = require('../../helpers/auth-helpers');

router.all('/*', userAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/posts', (req, res) => {
  res.render('admin/generate/posts');
});

router.post('/posts', (req, res) => {
  User.findOne({email: 'Adrien.Maranville@gmail.com'}).then(user => {
    for (let i = 0; i < req.body.numPosts; i++) {
      let post = new Post();
      post.user = user._id;
      post.title = faker.lorem.words();
      post.status = faker.random.number(2);
      post.body = faker.lorem.paragraphs();
      post.date = faker.date.recent(15);
      post.file = '1551035123904-cool_cat.jpg';
      post.allowComments = faker.random.boolean();
      Category.findOneRandom(function (err, result) {
        post.category = result._id;
        post.save().then(savedPost => {
          console.log('saved!');
        });
      });
    }

    setTimeout(() => {
      res.redirect('/admin/posts');
    }, 500);
  });
});

router.get('/users', (req, res) => {
  res.render('admin/generate/users');
});

router.post('/users', (req, res) => {

  for (let i = 0; i < req.body.numUsers; i++) {
    let user = new User();
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.email = faker.internet.email();
    user.joined = faker.date.recent(15);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash('Secret12', salt, (err, hash) => {
        user.password = hash;
        user.save().then(savedUser => {
        }).catch(err => console.log((err)));
      });
    });
  }

  setTimeout(() => {
    res.redirect('/admin');
  }, 500);
});

router.get('/comments', (req, res) => {
  res.render('admin/generate/comments');
});

router.post('/comments', (req, res) => {
  Post.find({allowComments: true}).then(posts => {
    posts.forEach(post => {
      randNum = Math.floor(Math.random() * (req.body.numComments - 0 + 1));
      for (let i = 0; i < randNum; i++) {
        let comment = new Comment();
        comment.body = faker.lorem.paragraphs(1);
        comment.approval = faker.random.boolean();
        comment.date = faker.date.recent(15);
        comment.post = post._id;
        User.findOneRandom(function (err, result) {
          comment.user = result._id;
          comment.save().then(savedComment => {
            post.comments.push(savedComment);
          });
        });
      }
      setTimeout(() => {
        post.save().then(savedPost => {

        });
      }, 500);
    });
  });

  setTimeout(() => {
    res.redirect('/admin/comments');
  }, 500);
});

module.exports = router;
