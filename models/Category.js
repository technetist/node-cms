const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const random = require('mongoose-simple-random');

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  }
});

CategorySchema.plugin(random);

module.exports = mongoose.model('categories', CategorySchema);
