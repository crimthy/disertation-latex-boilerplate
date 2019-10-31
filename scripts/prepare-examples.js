const fs = require('fs')
const path = require('path')

const root =  path.join(__dirname, '../')
const examplesFolder = 'examples'


const indexFiles = (dirPath, result) => {
    result = result || []
    const targetPath = path.join(root,dirPath)
    fs.readdirSync(targetPath).forEach(file => {
        const targetFile = path.join(targetPath,file)
        if (fs.lstatSync(targetFile).isDirectory())
            indexFiles(path.join(dirPath, file), result)
        else
            result.push(path.join(dirPath, file))
    })
    return result
}

indexFiles(examplesFolder).forEach(file => {
    const fromPath = path.join(root, file)
    const toPath = path.join(root, file.split('/')[1])
    console.log(`Preparing ${file}`)
    fs.createReadStream(fromPath).pipe(fs.createWriteStream(toPath))
})