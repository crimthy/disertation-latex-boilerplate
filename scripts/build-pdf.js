const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const directory =  path.join(__dirname, '../build')
const fileName = process.argv[2] || 'example.tex'
!fs.existsSync(directory) && fs.mkdirSync(directory)

exec(`pdflatex -output-directory=${directory} -output-format=pdf -synctex=1 -interaction=nonstopmode ${fileName}`, (err, stdout, stderr) => {
  if (err) {
    console.log(`${err}`)
    return
  }
  console.log(`${stdout}`)
});