const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 character"],
  },
  price: {
    type: String,
    required: [true, "Please enter product price"],
    maxLength: [5, "Product price cannot exceed 5 character"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please select a category for this product"],
    enum: {
      values: [
        "Electronics",
        "Computers",
        "Automotive",
        "Smart Home",
        "Arts and Craft",
        "Video Games",
        "Men's Fashion",
        "Women's Fashion",
        "Home and Kitchen",
        "Movies and Television",
        "Pet Supplies",
        "Sports and Outdoors",
        "Toys",
        "Books",
      ],
      message: "Please select correct category for product",
    }
  },
  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [5, "Product quantity cannot exceed 5 character"],
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);
