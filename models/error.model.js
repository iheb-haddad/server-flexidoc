const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const errorSchema = new Schema(
    {
        idProject : { type: Schema.Types.ObjectId, ref: "project" },
        idSubProject: { type: Schema.Types.ObjectId, ref: "subProject" },
        idDocumentation: { type: Schema.Types.ObjectId, ref: "documentation" },
    }
);

const Error = mongoose.model("error", errorSchema);

module.exports = Error;