const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionSchema = new Schema(
  {
    titleFr: { type: String },
    titleEn: { type: String },
    titlePolice: { type: String },
    textPolice: { type: String },
    titleColor: { type: String },
    textColor: { type: String },
    backgroundColor: { type: String },
    fontSizeTitle : { type: String },
    fontSizeText : { type: String },
    paddingUnderTitle : { type: String }
  },
  { timestamps: true }
);

const Section = mongoose.model("section", sectionSchema);
module.exports = Section;
