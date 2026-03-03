import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    shopName: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const userModel =
    mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
