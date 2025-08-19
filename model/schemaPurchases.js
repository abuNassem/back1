const mongoose = require('mongoose');

const PurchasesSchema = new mongoose.Schema(
  {
  orderId: {
    type: Number,
    unique: true,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String, // String عشان الأرقام الطويلة
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },


  // كل المنتجات التي تم شراؤها
  items: [
    {
      id: { type: Number, required: true },
      title: String,
      cat_prefix: String,
      img: String,
      price: String,
      quantity: Number,
      isInCart: Boolean,
      isFavorit: Boolean,
      discount: Number,
      about: String,
      color: String,
      size: { type: String, enum: ["XS", "S", "M", "L", "XL", "2XL"] },
      brand: String,
      gender: { type: String, enum: ["male", "female", "unisex"] },
      material: { type: String, enum: ["cotton", "polyester", "wool"] },
      subcategory: String,
      rating: Number,
      addedDate: String
    }
  ],

  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'paypal'],
    required: true,
    default:'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'refunded'],
    default: 'unpaid'
  },
  priceWithDelavery:{
    type:Number,
    required:true
  },
  dateOrder:{
    type:String,
    required:true
  }

}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchasesSchema);
