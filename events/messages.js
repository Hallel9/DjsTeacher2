const client = require('../index'),
    Discord = require('discord.js'),
    fs = require('fs'),
    db = require('../models/prefix'),
    bl = require('../models/blacklist'),
    gbl = require('../models/guildblacklist')

client.on('messageCreate', msg)
client.on('messageUpdate', msg)

async function msg(message, newmessage) {
    if (await bl.findOne({userid: message.author.id})) return
    if (await gbl.findOne({guildid: message.guild.id})) return
    let prefix = client.config.prefix
    const newp = await db.findOne({Guild: message.guild.id})
    if (newp) prefix = newp.Prefix


    
    
    

    
    if (newmessage) {
        if (message.content == newmessage.content) return
        message = newmessage
    }
    if (message.author.bot || !message.guild) return

    function send(txt, ...components) {
        return new Promise((resolve, reject) =>
            message.channel
                .send(typeof txt == 'object' ? {embeds: [txt], components} : {content: txt, components})
                .then(resolve)
                .catch(reject)
                )
    }
    const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        if (message.content.match(new RegExp(`^<@!?${client.user.id}>\\s*(prefix)?$`, 'i'))) {
            embed.setTitle('Djs Teacher')
            embed.setDescription('My prefix is <@' + client.user.id +  '>. Run `/help` or `@' + client.user.username +  ' help` to see my commands.')
            return send(embed)
        }
        let match = message.content.match(new RegExp(`^<@!?${client.user.id}>\\s*`))
        if (!match) return
        let [cmd, ...args] = message.content.replace(new RegExp(`^<@!?${client.user.id}>\\s*`), '').split(/ +/)
        cmd = cmd.toLowerCase()
        if (!cmd) return
    const command = client.commands.get(cmd) || client.commands.find((c) => c.aliases?.includes(cmd))
    if (!command) {
        embed.setTitle('Invalid command.')
        embed.setDescription("This command doesn't exist. Run `/help` to see my commands.")
        embed.setColor('RED')
        return send(embed)
    }
    if (command.dev && !client.owners.includes(message.author.id)) return

    if (command.permis && !client.owners.includes(message.author.id)) {
        for (const perm of command.permis) {
            if (!client.config.permis.includes(perm)) throw new Error("Permission doesn't exist!")
            embed.setTitle('Invalid permissions.')
            embed.setDescription("You don't have the required permissions to execute this command.")
            embed.setColor('RED')
            if (!message.member.permissions.has(perm)) return send(embed)
        }
    }

    if (command.botPerms) {
        for (const perm of command.botPerms) {
            if (!client.config.permis.includes(perm)) throw new Error('That permission node does not exist.')
            embed.setTitle('INVALID PERMISSIONS')
            embed.setDescription('I do not have the required permissions to execute this command.\nPermissions needed: ' + command.botPerms.join(', ').replace(/_/g, ' ').toLowerCase())
            embed.setColor('RED')
            if (!message.guild.me.permissions.has(perm)) return send(embed)
            if (!message.channel.permissionsFor(message.guild.me).has(perm)) return send(embed)
        }
    }

    if (cmd.match(/learnjs\d+/)) return
    try {
        // message.mentions.users.map(a => {
            // if (a.id == client.user.id) {
                // remove from this map
            // }
        // })
        message.mentions.users.delete(client.user.id)
        // let arr = []
        // message.mentions.users.forEach(a => arr.push(a))
        // arr.splice(1)
        // message.mentions.users = arr
        // console.log(message.mentions.users)
        await command.run(client, message, args, Discord, send, embed)
        client.log(`${message.author.tag} (${message.author.id}) ran the command "${command.name}" in the guild ${message.guild.name} (${message.guild.id}) in #${message.channel.name} (${message.channel.id})`)
        const wh = new Discord.WebhookClient({
            url: 'https://discord.com/api/webhooks/881736723506266122/obQiDT8SD57aHdMpSHjRvdUwOaBrF1Ki9MMrjMer-1Yiw3-T_HfgjQeJCzSVsr-hpZyI'
        })
        const newEmbed = new Discord.MessageEmbed()
            .setDescription(`${message.author.tag} (${message.author.id}) ran the command ${command.name} in ${message.guild.name} (${message.guild.id})`)
            .setColor('GREEN')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
        wh.send({
            username: 'Djs Teacher Commands',
            avatarURL: client.user.displayAvatarURL(),
            embeds: [newEmbed]
        })
    } catch (err) {
        fs.appendFileSync('./errors.log', `Error in ${command.name}: ${err.stack}\n\n`)
        console.log(err)
        embed.setTitle('An error occured.').setDescription('Please try again later.').setColor('RED').addField('Error', err.message)
        return send(embed)
    }
}
