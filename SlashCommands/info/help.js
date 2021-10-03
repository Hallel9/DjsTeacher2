const {Message, MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js')
const Client = require('../../index')

module.exports = {
    name: 'help',
    description: 'View my slash commands',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, Discord, send) => {
        const emojis = {
            info: 'ℹ'
        }
        const directories = [...new Set(client.slashCommands.map((c) => c.directory))]
        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

        const categories = directories.map((dir) => {
            const getCommands = client.slashCommands
                .filter((cmd) => cmd.directory === dir)
                .map((cmd) => {
                    return {
                        name: cmd.name || 'No Command Name',
                        description: cmd.description || 'No Command Description'
                    }
                })

            return {
                directory: formatString(dir),
                commands: getCommands
            }
        })

        categories.map((a) => {
            if (a.directory == 'Learnjs') categories.splice(categories.indexOf(a), 1)
            if (!client.owners.includes(message.author.id) && a.directory == 'Owner') categories.splice(categories.indexOf(a), 1)
        })

        const embed = new MessageEmbed()
            .setTitle('My dependencies')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=840219275461132348&permissions=8&scope=applications.commands%20bot')
            .setDescription('Please choose a category in the dropdown menu.')
            .setColor('RANDOM')
            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
        const components = (state) =>
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId('help-menu')
                    .setPlaceholder('Please select a string.')
                    .setDisabled(state)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Commands from ${cmd.directory} category`,
                                emoji: emojis[cmd.directory.toLowerCase()] || null
                            }
                        })
                    )
            )

        const initialMessage = await send(embed, components(false))

        const filter = (interaction) => interaction.user.id == message.author.id

        const collector = message.channel.createMessageComponentCollector({
            filter,
            componentType: 'SELECT_MENU'
        })

        collector.on('collect', (interaction) => {
            const [directory] = interaction.values
            const category = categories.find((x) => x.directory.toLowerCase() === directory)

            const categoryEmbed = new MessageEmbed()
                .setTitle(`${directory} commands`)
                .setColor('RANDOM')
                .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                .setDescription('Here is the list of commands')
                .addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `\`${cmd.name}\``,
                            value: cmd.description,
                            inline: true
                        }
                    })
                )

            interaction.update({
                embeds: [categoryEmbed]
            })
        })

        collector.on('end', () =>
            initialMessage.edit({
                components: components(true)
            })
        )
    }
}
