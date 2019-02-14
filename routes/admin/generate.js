const Post = require('../../models/Post');
const faker = require('faker');
const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/posts', (req, res) => {
  res.render('admin/generate/posts');
});

router.post('/posts', (req, res) => {
  for (let i = 0; i < req.body.numPosts; i++) {
    let post = new Post();
    post.title = faker.lorem.words();
    post.status = faker.random.number(2);
    post.body = faker.lorem.paragraphs();
    post.allowComments = faker.random.boolean();
    post.save().then(savedPost=>{
      console.log('saved post!')
    });
  }
  res.redirect('/admin/posts');
});

module.exports = router;
