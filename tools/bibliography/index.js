const readline = require('readline')
const fs = require('fs')
const request = require("request")
const cheerio = require("cheerio")

const readInterface = readline.createInterface({
    input: fs.createReadStream('sources'),
    console: false
})

readInterface.on('line', function(line) {
    parseUrl(line)
})  

const parseUrl = (url) => {
    request(url, function (error, response, body) {
        if (!error) {
            const $ = cheerio.load(body)
            const referencesTable = $(".references > li").each(function(i, elem) {
                const innerHtml = $(this).html()
                // parse logic
                console.log(innerHtml.length)
            })
        } else {
            console.log(`Can't parse ${url} --> ${error}`)
        }
    })
}