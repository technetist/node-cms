const mongoose = require('mongoose');
const UrlSlugs = require('mongoose-url-slugs');
const random = require('mongoose-simple-random');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  body: {
    type: String,
    required: true
  },
  file: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comments'
  }],
  slug: {
    type: String,
  }
});

PostSchema.plugin(UrlSlugs('title', {field: 'slug'}));
PostSchema.plugin(random);

module.exports = mongoose.model('posts', PostSchema);
