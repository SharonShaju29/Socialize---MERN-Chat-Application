const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "data:image/jpeg;base64,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",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
