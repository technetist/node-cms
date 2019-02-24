const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  approval: {
    type: Boolean,
    required: true,
    default: false,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'posts'
  },
  date: {
    type: Date,
    default: Date.now(),
  }
});

CommentSchema
  .virtual('created').get(function () {
  if (this["_created"]) return this["_created"];
  return this["_created"] = this._id.getTimestamp();
});

module.exports = mongoose.model('comments', CommentSchema);
