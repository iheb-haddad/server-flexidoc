const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memoSchema = new Schema(
  {
    text: { type: String },
    idSource: { type: Schema.Types.ObjectId, ref: "source" },
  },
  { timestamps: true }
);

const Memo = mongoose.model("memo", memoSchema);
module.exports = Memo;
