const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        name: { type: String },
        description: { type: String }
    },
    { timestamps: true }
    );

const Project = mongoose.model("project", projectSchema);

module.exports = Project;