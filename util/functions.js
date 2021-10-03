const guide = require('../guidedata.json')
const allKeys = Object.keys(guide)

function find(fName) {
    let features = []
    if (!fName) return features;
    for (let key of allKeys) {
        if (key.includes(fName)) {
            features.push(key)
        }
    }
    return features;
}

function getURL(a) {
    let url = ''
    if (allKeys.includes(a)) {
        url = guide[a]
    }
    return url
}

module.exports = {find, getURL}