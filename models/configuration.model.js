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
    timer : { type: Number},
    backgroundLanguage: { type: String },
    textColorLanguage: { type: String },
    buttonMemoBgColor: { type: String },
    buttonMemoFontColor: { type: String },
    buttonMemoFontSize: { type: String },
    sectionEmailDisplay: { type: String },
    fontTitleMemo: { type: String },
    fontTextMemo: { type: String },
    arrondiMemo: { type: String },
  },
  { timestamps: true }
);

const Configuration = mongoose.model("configuration", confSchema);
module.exports = Configuration;
