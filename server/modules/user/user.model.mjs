import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    first_name: String,
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

export default model("user", UserSchema);
