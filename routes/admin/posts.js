const Category = require('../../models/Category');
const Post = require('../../models/Post');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const {isEmpty, uploadDir} = require('../../helpers/upload-helpers');
const {userAuthenticated} = require('../../helpers/auth-helpers');

router.all('/*', userAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  Post.find()
    .populate('category')
    .then(posts => {
    res.render('admin/posts/index', {posts: posts});
  }).catch(err => {
    console.log(err.message)
  });
});

router.get('/create', (req, res) => {
  Category.find({}).then((categories) => {
    res.render('admin/posts/create', {categories: categories});
  }).catch(err=>console.log(err));
});

router.post('/create', (req, res) => {
  let errors = {};
  if (!req.body.title) {
    errors['title'] = 'A title is required.';
  }
  if (!req.body.body) {
    errors['body'] = 'A body is required.';
  }

  if (Object.keys(errors).length > 0) {
    res.render('admin/posts/create', {
      errors: errors
    });
  } else {

    let filename = '';
    if (!isEmpty(req.files)) {
      let uploadedFile = req.files.postImage;
      filename = Date.now() + '-' + uploadedFile.name;

      uploadedFile.mv('./public/uploads/' + filename, (err) => {
        if (err) throw err;
      })
    }
    let allowComments;
    allowComments = !!req.body.allowComments;
    const newPost = new Post({
      user: req.user.id,
      title: req.body.title,
      status: req.body.status,
      allowComments: allowComments,
      body: req.body.body,
      file: filename,
      category: req.body.category
    });

    newPost.save().then(savedPost => {
      req.flash('success_message', `Post titled ${savedPost.title} was created successfully!`);
      res.redirect('/admin/posts')
    }).catch(err => console.log((err)));
  }
});

router.get('/:id', (req, res) => {
  Post.findOne({_id: req.params.id}).then(post => {
    Category.find({}).then(categories=> {
      res.render('admin/posts/edit', {post: post, categories: categories});
    }).catch(err => {
      console.log(err.message)
    });
  }).catch(err => {
    console.log(err.message)
  });
});

router.put('/:id', (req, res) => {
  Post.findOne({_id: req.params.id}).then(post => {
    let allowComments;
    allowComments = !!req.body.allowComments;
    post.user = req.user.id;
    post.title = req.body.title;
    post.allowComments = allowComments;
    post.status = req.body.status;
    post.body = req.body.body;
    post.category = req.body.category;

    if (!isEmpty(req.files)) {
      let uploadedFile = req.files.postImage;
      let filename = Date.now() + '-' + uploadedFile.name;
      post.file = filename;

      uploadedFile.mv('./public/uploads/' + filename, (err) => {
        if (err) throw err;
      });
    }

    post.save().then(updatedPost => {
      req.flash('success_message', `Post titled ${updatedPost.title} was updated successfully!`);
      res.redirect('/admin/posts/' + updatedPost._id);
    }).catch(err => console.log((err)));
  });
});

router.delete('/:id', (req, res) => {
  Post.findOne({_id: req.params.id})
    .populate('comments')
    .then(post => {
    fs.unlink(uploadDir + post.file, (err) => {
      if(!post.comments.length < 1) {
        post.comments.forEach(comment=>{
          comment.remove();
        });
      }
      if (err) console.log(err);
      post.remove();
      req.flash('success_message', `Post titled ${post.title} was removed!`);
      res.redirect('/admin/posts');
    });

  }).catch(err => console.log((err)));
});

module.exports = router;
