const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const languageSchema = new Schema({
        code: { type: String },
        name: { type: String }
    },
    { timestamps: true }
    );

const Language = mongoose.model("language", languageSchema);
module.exports = Language;