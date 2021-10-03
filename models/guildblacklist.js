const mongoose = require('mongoose')

const guildblacklist = mongoose.Schema({
    guildid: String,
    guildname: String
})

module.exports = mongoose.model('guildblacklist', guildblacklist, 'guildBlacklist')
