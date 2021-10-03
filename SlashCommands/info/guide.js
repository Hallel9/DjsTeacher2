const {Message, MessageEmbed} = require('discord.js')
const Client = require('../../index')
const {find, getURL} = require('../../util/functions')
const axios = require('axios').default
module.exports = {
    name: 'guide',
    description: 'Get stuff from the guide',
    options: [
        {
            name: 'query',
            description: 'The query to search for',
            required: true,
            type: 'STRING'
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {MessageEmbed} embed
     */
    run: async (client, message, args, Discord, send, embed) => {
        let txt = args.join(' ');
        if (txt) txt = txt.toLowerCase();
        embed.setColor('RED').setTitle('Invalid Arguments').setDescription('You need to specify a valid search term to get from the guide.')
        let found = find(txt)
        if (!found[0]) return send(embed)
        let url = getURL(found[0])
        axios.get(url).then(async (res) => {
            let { data } = res
            if (!data) return send(embed)
            data = data.replace(/&#39;/g, "'")
            data = data.replace(/<.?code>/g, '')
            let result = /#<\/a>(.+)/.exec(data)[1]
            let title = result.substring(0, result.indexOf('</h1>'))?.trim(),
                description = result.substring(result.indexOf('<p>') + 3, result.indexOf('</p>')), 
                rawCode = data.substring(data.indexOf('<pre class="language-javascript">') + 33, data.indexOf('</div><br><div class="highlight-line">'))
            description = description.replace(/<\/?[^>]+(>|$)/g, '')
            const resEmbed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true })).setTimestamp().setColor('379c6f').setTitle(title).setURL(url).setDescription(description)
            const html2md = require('html-to-md')
            let code = await html2md(rawCode, {emptyTags: ['']})
            if (code && code.match(/discord\.js|client/) && !rawCode.includes(':root')) {
                code = code.replace(/<\/?[^>]+(>|$)/g, '').replace(/;/g, ';\n')
                if (code.startsWith('`')) code = code.substring(1, code.lastIndexOf('`'))
                if (code.length > 1024) code = code.substring(0, 1000) + '\n// the rest'
                
                resEmbed.addField('Example', '```js\n' + code + '```')
            }
            const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel(title).setURL(url).setStyle('LINK'))
            send(resEmbed, row)
        })
    }
}
