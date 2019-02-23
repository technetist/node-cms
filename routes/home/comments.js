const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'home';
  next();
});

router.post('/', (req, res) => {
  Post.findOne({_id: req.body.post_id})
    .then(post=>{
    const newComment = new Comment({
      user: req.user.id,
      body: req.body.body
    });
    post.comments.push(newComment);
    post.save().then(savedPost=>{
      newComment.save().then(savedComment => {
        req.flash('success_message', `Your comment has been added!`);
        res.redirect(`/post/${post.id}`);
      });
    });
  });
});

router.delete('/delete/:id', (req, res) => {
  Comment.findOne({_id: req.params.id}).then(comment => {
    comment.remove().then(removedComment => {
      res.status(200);
      res.send('Success');
    }).catch(err => console.log((err)));
  }).catch(err => {
    console.log(err.message);
  });
});


module.exports = router;
