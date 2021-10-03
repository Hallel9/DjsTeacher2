const client = require('../index')
const Discord = require('discord.js')
const fs = require('fs')
const user = require('../models/blacklist')
const guild = require('../models/guildblacklist')
// const db = require('../models/')
client.on('interactionCreate', async (interaction) => {
    function send(txt, ...components) {
        return new Promise((resolve, reject) =>
            interaction
                .followUp(typeof txt == 'object' ? {embeds: [txt], components} : {content: txt, components})
                .then(resolve)
                .catch(reject)
        )
    }
    const message = {
        author: client.users.cache.get(interaction.user.id),
        channel: client.channels.cache.get(interaction.channelId),
        guild: client.guilds.cache.get(interaction.guildId),
        member: client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user?.id),
        id: interaction.id,
        type: interaction.type,
        version: interaction.version,
        command: interaction.command,
        deferred: interaction.deferred,
        replied: interaction.replied,
        ephemeral: interaction.ephemeral,
        interaction: interaction
    }
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => { })
        if (await user.findOne({ userid: interaction.user.id })) return interaction.followUp({ content: 'You are blacklisted from using ' + client.user.username + '.', ephemeral: true })
        if (await   guild.findOne({guildid: interaction.guild.id})) return interaction.followUp({ content: 'This server has been blacklisted from using ' + client.user.username + '.', ephemeral: true })
        const cmd = client.slashCommands.get(interaction.commandName)
        if (!cmd) return interaction.followUp({content: 'An error has occured '})

        const args = []

        for (let option of interaction.options.data) {
            if (option.type === 'SUB_COMMAND') {
                if (option.name) args.push(option.name)
                option.options?.forEach((x) => {
                    if (x.name) args.push(x.name)
                    if (x.value) args.push(x.value)
                })
            } else if (option.value) args.push(option.value)
        }
        const embed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTimestamp()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        if (cmd.permis && !client.owners.includes(message.author.id)) {
            for (const perm of cmd.permis) {
                if (!client.config.permis.includes(perm)) throw new Error("Permission doesn't exist!")
                if (!message.member.permissions.has(perm)) {
                    embed.setTitle('Invalid permissions.')
                    embed.setDescription("You don't have the required permissions to execute this command.")
                    embed.setColor('RED')
                    return send(embed)
                }
            }
        }
        try {
            await cmd.run(client, message, args, Discord, send, embed)
            client.log(`${message.author.tag} (${message.author.id}) ran the slash command "${cmd.name}" in the guild ${message.guild.name} (${message.guild.id}) in #${message.channel.name} (${message.channel.id})`)
            const wh = new Discord.WebhookClient({
                url: 'https://discord.com/api/webhooks/881736723506266122/obQiDT8SD57aHdMpSHjRvdUwOaBrF1Ki9MMrjMer-1Yiw3-T_HfgjQeJCzSVsr-hpZyI'
            })
            const newEmbed = new Discord.MessageEmbed()
                .setDescription(`${message.author.tag} (${message.author.id}) ran the command ${cmd.name} in ${message.guild.name} (${message.guild.id})`)
                .setColor('GREEN')
                .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            wh.send({
                username: 'Djs Teacher SlashCommands',
                avatarURL: client.user.displayAvatarURL(),
                embeds: [newEmbed]
            })
        } catch (err) {
            fs.appendFileSync('./errors.log', `Error in ${cmd.name}: ${err.stack}\n\n`)
            console.log(err)
            embed.setTitle('An error occured.').setDescription('Please try again later.').setColor('RED').addField('Error', err.message)
            return send(embed)
        }
    }

    if (interaction.isContextMenu()) {
        await interaction.deferReply({ephemeral: false})
        const command = client.slashCommands.get(interaction.commandName)
        if (command) command.run(client, null, interaction)
    }
})
