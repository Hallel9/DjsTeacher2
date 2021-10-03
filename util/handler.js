const {glob} = require('glob')
const {promisify} = require('util')
const globPromise = promisify(glob)
const chalk = require('chalk')
const t = performance.now()
module.exports = async (client) => {
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`)
    commandFiles.map((a) => {
        const file = require(a)
        const splitted = a.split('/')
        const directory = splitted[splitted.length - 2]

        if (file.name) {
            const properties = {directory, ...file}
            client.commands.set(file.name, properties)
        }
    })

    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`)
    eventFiles.map((a) => require(a))

    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/*/*.js`)

    const arrayOfSlashCommands = []
    slashCommands.map((value) => {
        const file = require(value)
        if (!file?.name) return
        const splitted = value.split('/')
        const directory = splitted[splitted.length - 2]
        file.directory = directory
        client.slashCommands.set(file.name, file)

        if (['MESSAGE', 'USER'].includes(file.type)) delete file.description
        arrayOfSlashCommands.push(file)
    })
    client.on('ready', async () => {
        // Register for a single guild
        const nothing = () => {}
        client.guilds.cache.forEach((g) => g.commands.set(arrayOfSlashCommands).catch(nothing))
        // Register for all the guilds the bot is in
        // await client.application.commands.set(arrayOfSlashCommands);
        console.log(chalk.green(`Registered all slash and normal commands for all servers!`))
    })
}
