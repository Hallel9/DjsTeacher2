const {Message, MessageEmbed} = require('discord.js')
const search = require('youtube-search')
const Client = require('../../index')

module.exports = {
    name: 'youtube',
    description: 'Search for something on yt',
    options: [
        {
            name: 'video',
            description: 'Search for a video',
            type: 'STRING',
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {MessageEmbed} embed
     * @param {import 'discord.js'} Discord
     */
    run: async (client, message, args, Discord, send, embed) => {
        const opts = {
            maxResults: 25,
            key: client.config.YOUTUBE_API
        }
        const [text] = args

        search(args.join(' '), opts, async (err, results) => {
            if (err) return send(`Error: ${err}`)
            
            if (!results[0])  return send('No results found')
            
            const {description, thumbnails, title, link, channelTitle, id} = results[0]
            const embed = new MessageEmbed().setColor('#0099ff').setTitle(title).setURL(link).setAuthor(channelTitle).setThumbnail(thumbnails.default.url).addField('Video ID', id).setTimestamp().setDescription(description)
            send(embed)
        })
    }
}
