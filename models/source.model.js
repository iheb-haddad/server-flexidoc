const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sourceSchema = new Schema(
  {
    idProject: { type: Schema.Types.ObjectId, ref: "project" },
    idSubProject: { type: Schema.Types.ObjectId, ref: "subProject" },
    name: { type: String },
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

const Source = mongoose.model("source", sourceSchema);
module.exports = Source;
