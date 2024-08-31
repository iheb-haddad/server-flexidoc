const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    role : { type: String, default: "user"},
    projects: [{ type: Schema.Types.ObjectId, ref: "project" }],
    subProjects: [{ type: Schema.Types.ObjectId, ref: "subProject" }],
    username: { type: String},
    firstName: {type: String},
    lastName: {type: String},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    numTel: {type: String},
    country: {type: String},
    region: {type: String},
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
