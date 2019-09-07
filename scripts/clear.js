const fs = require('fs')
const path = require('path')

const directory =  path.join(__dirname, '../build')

fs.readdir(directory, (err, files) => {
  if (err) { console.log(`${err}`); process.exit(1); }
  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err
    })
  }
})