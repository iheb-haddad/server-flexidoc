const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subProjectSchema = new Schema(
    {
        idProject: { type: Schema.Types.ObjectId, ref: "project" },
        name: { type: String },
        description: { type: String }
    },
    { timestamps: true }
    );

const SubProject = mongoose.model("subProject", subProjectSchema);

module.exports = SubProject;