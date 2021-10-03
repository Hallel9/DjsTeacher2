const {Message, MessageEmbed} = require('discord.js')
const Client = require('../../index')

module.exports = {
    name: 'ping',
    description: 'Pong',
    type: '',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {MessageEmbed} embed
     */
    run: async (client, message, args, Discord, send, embed) => {
        const msg = await send('pinging...')
        msg.delete()
        message.channel.send({content: `🏓 Client ping: ${client.ws.ping}`})
    }
}