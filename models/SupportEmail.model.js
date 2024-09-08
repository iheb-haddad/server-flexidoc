const mongoose = require('mongoose')
const Schema = mongoose.Schema

const supportEmailSchema = new Schema(
    {
        idProject: { type: Schema.Types.ObjectId, ref: "project" },
        idSubProject: { type: Schema.Types.ObjectId, ref: "subProject" },
        email: { type: String }
    },
    { timestamps: true }
)

const SupportEmail = mongoose.model("supportEmail", supportEmailSchema)
module.exports = SupportEmail