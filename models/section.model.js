const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionSchema = new Schema(
  {
    titleFr: { type: String },
    titleEn: { type: String },
    customTitles: [
      {
        title: { type: String },
        language: { type: String }
      }
    ],
    titlePolice: { type: String },
    textPolice: { type: String },
    titleColor: { type: String },
    textColor: { type: String },
    backgroundColor: { type: String },
    fontSizeTitle: { type: String },
    fontSizeText: { type: String },
    paddingUnderTitle: { type: String },
    traitDisplay: { type: String },
    traitColor: { type: String },
    traitWidth: { type: String },
    sectionBorderDisplay: { type: String },
    sectionBorderWidth: { type: String },
    sectionBorderColor: { type: String },
    sectionBorderRound: { type: String },
    order: { type: Number },
  },
  { timestamps: true }
);

const Section = mongoose.model("section", sectionSchema);
module.exports = Section;
