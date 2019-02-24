const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  joined: {
    type: Date,
    default: Date.now(),
  }
});

UserSchema.methods.validPassword = function (password,cb) {
  bcrypt.compare(password, this.password, (err, matched) => {
    if (err) return cb(err);
    cb(null, matched);
  });
};

module.exports = mongoose.model('users', UserSchema);
