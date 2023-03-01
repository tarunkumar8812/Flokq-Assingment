const mongoose = require("mongoose")

const DataSchema = new mongoose.Schema({
    jobId: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    result: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("Data", DataSchema);