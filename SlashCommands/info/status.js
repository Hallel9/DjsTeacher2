const {Message, MessageEmbed} = require('discord.js')
const Client = require('../../index')
const {connection} = require('mongoose')

module.exports = {
    name: 'status',
    description: 'status',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {MessageEmbed} embed
     */
    run: async (client, message, args, Discord, send, embed) => {
        let totalSeconds = client.uptime / 1000
        let days = Math.floor(totalSeconds / 86400)
        totalSeconds %= 3600
        let hours = Math.floor(totalSeconds / 3600)
        totalSeconds %= 3600
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = Math.floor(totalSeconds % 60)
        const Response = new Discord.MessageEmbed().setColor('BLURPLE').setDescription(
            `   **Bot Status**
                \n **Client**: \`🟢 Online!\`
                \n **Database**: \`${switchTo(connection.readyState)}\`
                \n **Client Ping**: \`${client.ws.ping}ms\`
                \n **Uptime**: ${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`
        )
        return send(Response)
    }
}

function switchTo(val) {
    return ['🔴 Disconnected!', '🟢 Connected!', '🟡 Connecting...', '🔵 Disconnecting...'][val]
}
