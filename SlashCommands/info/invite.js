const {Message, MessageEmbed} = require('discord.js')
const Client = require('../../index')

module.exports = {
    name: 'invite',
    description: 'Get the bots invite',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {MessageEmbed} embed
     */
    run: async (client, message, args, Discord, send, embed) => {
        embed.setTitle('INVITE')
        embed.setDescription(`Invite me to your server **[here](${client.invite})**`)
        send(embed)
    }
}
