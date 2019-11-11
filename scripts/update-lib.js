const request = require('request-promise')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
var https = require('https')

const masterName = 'disertation-latex-boilerplate'
const masterOwner = 'crimthy'
const githubApiEndpoint = 'https://api.github.com/repos'
const root =  path.join(__dirname, '../')

const hashFile = targetFile  => {
    return new Promise(function(resolve, reject) {
        fs.createReadStream(targetFile).
                pipe(crypto.createHash('sha1').setEncoding('hex')).
                on('finish', function () {
                    hash = this.read()
                    resolve(hash)
            })
    })
}

const libIndex = (dirPath, result) => {
    result = result || []
    const targetPath = path.join(root,dirPath)
    fs.readdirSync(targetPath).forEach(file => {
        const targetFile = path.join(targetPath,file)
        if (fs.lstatSync(targetFile).isDirectory())
            libIndex(path.join(dirPath, file), result)
        else
            result.push(path.join(dirPath, file))
    })
    return result
}

const indexFiles = (targetPath) => {
    const options = {
        method: 'GET',
        uri: `${githubApiEndpoint}/${masterOwner}/${masterName}/contents/${targetPath}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36',
            'Accept': 'application/vnd.github.v3+json'
        }
    }

    request(options)
        .then(function (response) {
            const clear = (p) => fs.unlink(p)
            const responseObject = JSON.parse(response)

            const files  = responseObject.filter(element => element['type'] === 'file')
            files.forEach(element => {
                const filePath = path.join(root,element['path'])
                try {
                    if (fs.existsSync(filePath)) {
                        hashFile(filePath).then(function(localFileHash) {
                            const tempPath = path.join(__dirname, localFileHash)
                            const file = fs.createWriteStream(tempPath)
                            https.get(element['download_url'], function(response) {
                                response.pipe(file)
                                hashFile(tempPath).then(function(downloadedFileHash) {
                                    if (localFileHash !== downloadedFileHash) {
                                        console.log(`File: ${element['path']} has new version, replacing...`)
                                        file.on('finish', function() {
                                            const updatedFile = fs.createWriteStream(filePath)
                                            fs.createReadStream(tempPath).pipe(updatedFile)
                                            updatedFile.on('finish', function(){clear(tempPath)})
                                        })
                                    }
                                    else clear(tempPath)
                                })
                            }) 
                        })
                    }
                }
                catch(err) {
                    console.log(`New file ${element['path']}, saving...`)
                    const file = fs.createWriteStream(filePath)
                    https.get(element['download_url'], function(response) {
                        response.pipe(file)
                    })
                }
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