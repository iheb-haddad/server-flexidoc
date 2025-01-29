const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const themeSchema = new Schema(
  {
    name: { type: String },
    desciption: { type: String },
    configuration: {
      panelColor: { type: String },
      panelTextColor: { type: String },
      panelWidth: { type: String },
      memoBackgroundColor: { type: String },
      memoFontColor: { type: String },
      memoSection: { type: String },
      resizeBarWidth: { type: String },
      timer: { type: Number },
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
    sections: [
        {
        titleFr: { type: String },
        titleEn: { type: String },
        customTitleFr: { type: String },
        customTitleEn: { type: String },
        titlePolice: { type: String },
        textPolice: { type: String },
        titleColor: { type: String },
        textColor: { type: String },
        backgroundColor: { type: String },
        fontSizeTitle : { type: String },
        fontSizeText : { type: String },
        paddingUnderTitle : { type: String },
        traitDisplay: { type: String },
        traitColor: { type: String },
        traitWidth: { type: String },
        sectionBorderDisplay: { type: String },
        sectionBorderWidth: { type: String },
        sectionBorderColor: { type: String },
        sectionBorderRound: { type: String },
        order: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const Theme = mongoose.model("theme", themeSchema);

module.exports = Theme;
