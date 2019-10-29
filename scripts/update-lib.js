const request = require('request-promise')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const masterName = 'disertation-latex-boilerplate'
const masterOwner = 'crimthy'
const githubApiEndpoint = 'https://api.github.com/repos'
const root =  path.join(__dirname, '../')

const indexFiles = (target_path) => {
    const options = {
        method: 'GET',
        uri: `${githubApiEndpoint}/${masterOwner}/${masterName}/contents/${target_path}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36',
            'Accept': 'application/vnd.github.v3+json'
        }
    }
    request(options)
        .then(function (response) {
            const responseObject = JSON.parse(response)

            const files  = responseObject.filter(element => element['type'] === 'file')
            files.forEach(element => {
                fs.createReadStream(path.join(root,element['path'])).
                    pipe(crypto.createHash('sha1').setEncoding('hex')).
                    on('finish', function () {
                        hash = this.read()
                        console.log(`File: ${element['path']}\nGithub: ${element['sha']}\nSelf: ${hash}\n\n`)
                })
            })

            responseObject.
                filter(element => element['type'] === 'dir').
                forEach(element => indexFiles(element['path']))
        })
        .catch(function (err) {
            console.log(`${err}`)
        })
}

indexFiles('lib')