const path = require('path');
const fs = require('fs');

class PluginsManager {
    constructor(dirName = "plugins") {
        this.dirName = dirName;
    }

    load() {
        const directoryPath = path.join(__dirname, this.dirName);
        return fs.readdirSync(directoryPath).
            filter(name => /^[A-Z]+.*\.js$/.test(name));
    }

    exportPlugins() {
        const files = this.load();
        let exportedPlugins = {};
        files.forEach(name => {
            const usageName = name.replace(/\..+$/, '');
            exportedPlugins[usageName] = require(`./${this.dirName}/${name}`);
        });
        return exportedPlugins;
    }

    get exports() {
        return this.exportPlugins();
    }
}

module.exports = PluginsManager;