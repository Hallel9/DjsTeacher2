const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    Guild: String,
    Prefix: String
})

module.exports = mongoose.model('prefix', Schema, 'prefix')
