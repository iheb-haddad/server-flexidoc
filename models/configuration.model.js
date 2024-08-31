const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const confSchema = new Schema(
  {
    idProject: { type: Schema.Types.ObjectId, ref: "project" },
    panelColor: { type: String },
    panelTextColor: { type: String },
    panelWidth: { type: String },
    memoBackgroundColor: { type: String },
    memoFontColor: { type: String },
    memoSection: { type: String },
    generalUrl: { type: String },
    resizeBarWidth : { type: String },
    timer : { type: Number}
  },
  { timestamps: true }
);

const Configuration = mongoose.model("configuration", confSchema);
module.exports = Configuration;
