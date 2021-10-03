const mongoose = require('mongoose')

const userschema = mongoose.Schema({
    userid: String,
    username: String
})

module.exports = mongoose.model('user', userschema)
