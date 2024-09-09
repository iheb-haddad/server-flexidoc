const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const docSchema = new Schema(
  {
    idProject : { type: Schema.Types.ObjectId, ref: "project" },
    idSubProject: { type: Schema.Types.ObjectId, ref: "subProject" },
    language: {type: String},
    title: {type: String},
    status: {type: String},
    urlDoc: {type: String},
    display: {type: String},
    note : {type: String},
    expiration: {type: Date},
    keywords: [{type: String}],
    consultationNumber: {type: Number},
    lastConsultation: {type: Date},
  },
  { timestamps: true }
);

const Documentation = mongoose.model("documentation", docSchema);
module.exports = Documentation;
