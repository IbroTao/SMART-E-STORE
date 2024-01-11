const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      count: {
        type: Number,
      },
      color: {
        type: String,
      },
    },
  ],
  paymentIntent: {},
  orderStatus: {
    type: String,
    default: "Not Processed",
    enum: [
      "Not Processed",
      "Cash on Delivery",
      "Processing",
      "Dispatched",
      "Cancelled",
    ],
  },
  orderBy: {},
});
