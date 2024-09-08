const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const smtpConfigurationSchema = new Schema(
    {
        idProject: { type: Schema.Types.ObjectId, ref: "project" },
        host: { type: String },
        port: { type: Number },
        user: { type: String },
        pass: { type: String },
        type: { type: Boolean },
    },
    { timestamps: true }
);

const SmtpConfiguration = mongoose.model("smtpConfiguration", smtpConfigurationSchema);
module.exports = SmtpConfiguration;