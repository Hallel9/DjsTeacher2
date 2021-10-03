const {Message, MessageEmbed} = require('discord.js')
const Client = require('../../index')
const chalk = require('chalk')

module.exports = {
    name: 'eval',
    description: 'Evaluate code',
    aliases: ['e'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {MessageEmbed} embed
     */
    run: async (client, message, args, Discord, send, embed) => {
        if (!args[0]) return send('You need to eval something')
        try {
            if (args.join(' ').match(/token/i)) return send('No')
            if (!client.owners.includes(message.author.id)) {
                if (args.join(' ').match(/leave/i)) return send('No.')
            }
            let Eval
            if (args.join(' ').includes('await')) Eval = await eval('(async () => {' + args.join(' ') + '})()')
            else Eval = await eval(args.join(' '))
            function str(obj) {
                let a = JSON.stringify(obj)
                a = JSON.stringify(obj, null, 4)
                return a
            }
            function substr(str) {
                if (str?.length >= 1000) {
                    str = str.substring(0, 1000)
                    return str + '...```'
                }
                return str
            }
            let a
            if (typeof (await Eval) == 'object') a = `\`\`\`json\n${str(await Eval)}\`\`\``
            else a = await Eval
            if (a?.length >= 1000) substr(a)
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                .setColor('GREEN')
                .addField('To Eval:', '```js\n' + args.join(' ') + '```')
                .addField('Evaluated:', String(substr(a)))
                .addField('Type', typeof Eval)
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            send(embed)
        } catch (err) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                .setColor('RED')
                .setTitle(err.name)
                .setTimestamp()
                .setDescription(err.toString())
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            send(embed)
        }
    }
}
