const Discord = require('discord.js')
const mongoose = require('mongoose')
const chalk = require('chalk')
const {red} = require('chalk')
const db = require('../models/prefix')
module.exports = class extends Discord.Client {
    constructor() {
        super({
            allowedMentions: {parse: []},
            intents: 32767
        })
        this.config = require('../config.json')
        this.login(this.config.token)
        this.init()
        this.db(this.config.mongo)
        this.setStatus(['@Djs Teacher', 'Help with discord.js', '/help for commands'])
    }
    commands = new Discord.Collection()
    slashCommands = new Discord.Collection()
    getPrefix = async (Guild) => {
        if (typeof Guild === 'object') Guild = Guild.id
        if (isNaN(Guild)) Guild = this.guilds.cache.find((a) => a.name === Guild)?.id
        const data = await db.findOne({Guild})
        if (data) return data.Prefix
        return 'p?'
    }
    invite = `https://discord.com/api/oauth2/authorize?client_id=892211094909775912&permissions=8&scope=applications.commands%20bot`
    owners = ['241632903258177536', '513773028606476308']
    db(s) {
        mongoose
            .connect(s, {useNewUrlParser: true, useUnifiedTopology: true})
            .then(console.log(chalk.green('Connected to db!')))
            .catch((err) => console.log(red('Failed to connect to db!' + err)))
    }
    init() {
        require('../util/handler')(this)
    }
    log(...args) {
        console.log(chalk.green(`[${new Date().toLocaleString()}] -`, ...args))
    }
    setStatus(a) {
        setInterval(() => this.user.setActivity(a[Math.floor(Math.random() * a.length)], {type: 'WATCHING'}), 20000)
    }
}
