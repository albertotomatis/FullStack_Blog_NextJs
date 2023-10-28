import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: { 
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "author", "user"],
      default: "user", // Imposta il valore predefinito su "user" se non specificato
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpiry: {
      type: Date,
    },  
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
