const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

module.exports = mongoose.model("Note", noteSchema)