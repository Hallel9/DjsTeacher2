const fetch = require('node-fetch')
module.exports = {
    name: 'docs',
    description: 'Get info from the docs',
    options: [{
        name: 'query',
        description: 'The query to search for',
        required: true,
        type: 'STRING'
    }],
    async run(client, message, args, Discord, send, embed) {
        const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args.join(' '))}`
        let res;
        try {
            const raw = await fetch(url)
            res = await raw.json()
        } catch (er) {
            console.log(er);
            return send('An error occurred while fetching the docs.')
        }
        if (!res) return send('No results found.')
        res.fields.map(a => a.value = a.value.substring(0, 1018) + '...')
        send(res)
    } 
}