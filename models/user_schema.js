const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  passwordResetOTP: {
    type: String,
  },
  
  passwordResetExpiry: {
    type: Date,
  },

  image: {
    url: String,
    public_id: String,
  },

  // categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  quotaPerDay: { type: Number },
});

const User = mongoose.model("User", userSchema);

module.exports = User;