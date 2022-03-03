const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,

    },
    postCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true
    }
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Product'
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }],
  paymentInfo: {
    id: {
      type: String
    },
    status: {
      type: String
    }
  },
  paymentDate: {
    type: Date
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing'
  },
  deliveryDate: {
    type: Date
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Order', orderSchema);