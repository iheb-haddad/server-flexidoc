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
    collapsible : {type: Boolean},
    defaultEtat : {type: Boolean},
    note : {type: String},
    expiration: {type: Date},
    keywords: [{type: String}],
    consultationNumber: {type: Number},
    lastConsultation: {type: Date},
    isError: {type: Boolean},
    frameWidth: {type: String},
    frameHeight: {type: String},
  },
  { timestamps: true }
);

const Documentation = mongoose.model("documentation", docSchema);
module.exports = Documentation;
