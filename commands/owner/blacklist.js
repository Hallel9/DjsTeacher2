const {Message, MessageEmbed} = require('discord.js')
const Client = require('../../index')
const db = require('../../models/blacklist')

module.exports = {
    name: 'blacklist',
    description: 'Blacklist a user from using the bot.',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {MessageEmbed} embed
     */
    run: async (client, message, args, Discord, send, embed) => {
        const filter = (msg) => msg.author.id === message.author.id
        const options = {
            max: 1
        }
        let member = client.users.cache.get(args[0])
        if (!member) return send('You need to enter a user (mention or ID)')
        const data = await db.findOne({userid: member.id})
        if (data) {
            send('That user is already blacklisted. Would you like to whitelist them? Type `whitelist` to whitelist them or type `cancel` to cancel this action.')
            const msg = await message.channel.awaitMessages({filter, options})
            if (msg.first().content.toLowerCase() === 'cancel') {
                return send('Cancelled.')
            }
            if (msg.first().content.toLowerCase() === 'whitelist') {
                const whitelited = await db.findOneAndDelete({userid: member.id})
                return send('The user has been whitelisted.')
            }
        } else {
            await db.create({userid: member.id, username: member.username})
            send('The user was blacklisted!')
        }
    }
}
