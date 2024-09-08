const mongoose = require('mongoose')
const Schema = mongoose.Schema

const consultHistoricSchema = new Schema(
    {
        idDocumentation: { type: Schema.Types.ObjectId, ref: "documentation" },
        ipUser: { type: String },
        urlConsulted: { type: String },
        date: { type: Date },
    }
)

const ConsultHistoric = mongoose.model("consultHistoric", consultHistoricSchema)
module.exports = ConsultHistoric