const {Message, MessageEmbed} = require('discord.js')
const Client = require('../../index')
const blacklist = require('../../models/guildblacklist')

module.exports = {
    name: 'guildblacklist',
    description: 'Blacklist a guild from the bot',
    aliases: ['gb'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {MessageEmbed} embed
     */
    run: async (client, message, args, Discord, send, embed) => {
        const filter = (m) => m.author.id === message.author.id
        embed.setTitle('INVALID ARGUMENTS')
        embed.setDescription('Please specify a guild ID')
        embed.setColor('RED')
        if (!args[0]) {
            return send(embed)
        }
        let g = client.guilds.cache.get(args[0])
        embed.setTitle('INVALID GUILD')
        embed.setDescription('That is not a valid guild. Please specify an existing guild ID')
        if (!g) {
            return send(embed)
        }
        const db = await blacklist.findOne({guildid: g.id})
        if (db) {
            send('That guild is already blacklisted. Do you want to whitelist it? Type `whitelist` to whitelist the guild. Type `cancel` to cancel.')
            const msg = await message.channel.awaitMessages({filter, max: 1})
            if (msg.first().content.toLowerCase() === 'cancel') return send('Cancelled')
            if (msg.first().content.toLowerCase() === 'whitelist') {
                const unblacklist = await blacklist.findOneAndDelete({guildid: g.id})
                return send('Guild has been blacklisted!')
            }
        } else {
            const blacklisted = await blacklist.create({
                guildid: g.id,
                guildname: g.name
            })
            send(`${g.name} has been blacklisted!`)
        }
    }
}
