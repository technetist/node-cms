const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {},
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
  }
});

module.exports = mongoose.model('posts', PostSchema);
