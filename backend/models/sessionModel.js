const mongoose = require("mongoose");

let Schema = mongoose.Schema({
    nickname: String,
    token: String,
    email: String,
    ttl: String
})

module.exports = mongoose.model("Session", Schema);