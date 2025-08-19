const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  color: String,
  price: String,
  cat_prefix: String,
  img: String,
  about: String,
  discount: Number,
  size: String,
  brand: String,
  gender: String,
  material: String,
  subcategory: String,
  rating: Number,
  addedDate: Date,
});

module.exports = mongoose.model('Product', productSchema);
