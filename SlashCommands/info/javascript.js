const {Message, MessageEmbed} = require('discord.js')
const Client = require('../../index')
const axios = require('axios').default,
    jsCompat = require('js-browser-compat-data'),
    html2md = require('html-to-md')

module.exports = {
    name: 'javascript',
    description: 'Get stuff from the javascript docs',
    aliases: ['js'],
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
        let [text] = args
        embed.setTitle('Invalid Arguments').setDescription('You need to introduce a valid search term.').setColor('RED')
        const find = jsCompat.find(text)
        if (!find || !find[0]) return send(embed)
        const link = jsCompat.getMDNLink(find[0])
        if (!link) return send(embed)
        axios.get(link).then(async (res) => {
            let {data} = res
            if (!data) return send(embed)
            let title = data.substring(data.indexOf('<h1>') + 4, data.indexOf('</h1>')),
                description = data.substring(data.indexOf('<p>') + 3, data.indexOf('</p>')),
                other = data.substring(data.indexOf('<code><span class="token comment">') + 34, data.indexOf(`</code></pre></div>`))
            description = description
                .replace(/<.?strong>/g, '**')
                .replace(/<.?code>/g, '')
                .replace(/<.?em>/g, '*')
                .replace(/<.?a( href)?((.){1,})?>/g, '')
                .replace(/<.?span ?(.{1,})?>/g, '')

            let code = await html2md(other, {emptyTags: ['']})
            embed.setTitle(title).setURL(link).setDescription(description).setColor('BLUE')
            if (code.length < 800) embed.addField('Syntax', '```js\n' + code + '\n```')
            const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel(title).setStyle('LINK').setURL(link))
            send(embed, row)
        }, console.log)
    }
}
