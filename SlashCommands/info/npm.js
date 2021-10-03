const {Message, MessageEmbed} = require('discord.js')
const Client = require('../../index')
const fetch = require('node-fetch')
module.exports = {
    name: 'npm',
    description: 'NPM Command',
    options: [
        {
            name: 'package',
            description: 'The package you want to search for',
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
        const npm = args[0]

        let response

        try {
            response = await fetch(`https://api.npms.io/v2/search?q=${npm}`).then(res => res.json())
        } catch (err) {
            console.log(err)
            send('There seems to be a problem. Please check back later.')
        }

        try {
            const pkg = response.results[0].package
            embed
                .setTitle(pkg.name)
                .setColor('RED')
                .setURL(pkg.links.npm)
                .setThumbnail('https://images-ext-1.discordapp.net/external/JsiJqfRfsvrh5IsOkIF_WmOd0_qSnf8lY9Wu9mRUJYI/https/images-ext-2.discordapp.net/external/ouvh4fn7V9pphARfI-8nQdcfnYgjHZdXWlEg2sNowyw/https/cdn.auth0.com/blog/npm-package-development/logo.png')
                .setDescription(pkg.description)
                .addField('Version:-', pkg.version, true)
                .addField('Author:-', pkg.author ? pkg.author.name : 'None', true)
                .addField('Repository:-', pkg.links.respository ? pkg.links.respository : 'None', true)
                .addField('Maintainers:-', pkg.maintainers ? pkg.maintainers.map(m => m.username).join(', ') : 'None', true)
                .addField('Keywords', pkg.keywords ? pkg.keywords.join(', ') : 'None')
                .setTimestamp()
                send(embed)
        } catch {
            send('That is an invalid package.')
        }
    }
}
