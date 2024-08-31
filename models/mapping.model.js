const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mapSchema = new Schema(
  {
    idProject: { type: Schema.Types.ObjectId, ref: "project" },
    idSubProject: { type: Schema.Types.ObjectId, ref: "subProject" },
    idSection: { type: Schema.Types.ObjectId, ref: "section" },
    idSource: { type: Schema.Types.ObjectId, ref: "source" },
    idDocument: { type: Schema.Types.ObjectId, ref: "documentation" },
  },
  { timestamps: true }
);

const Mapping = mongoose.model("mapping", mapSchema);
module.exports = Mapping;
