import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  phone: {
    type: String,
    required: true,
    trim: true
  },

  address: {
    type: String,
    trim: true
  },

  balance: {
    type: Number,
    default: 0
  }
},
{ timestamps: true }
);
//! changining customer to Customer
const customerModel =
    mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default customerModel;
