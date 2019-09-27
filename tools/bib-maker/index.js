const readline = require('readline');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const BibTypes = require('./plugins/types');
const { BookDetails, SiteDetails } = require('./plugins/types-structures');
const PluginsManager = require('./PluginsManager')
const { Indicators, Colors, defaultBackgroundTextStyles } = require('./plugins/utils');
const program = require('commander');

console.log(`${Indicators.Info} Loading available plugins...`);

let plugins = new PluginsManager().exports;
let pluginNames = Object.keys(plugins);
console.log(`${Indicators.Ok} Loaded ${defaultBackgroundTextStyles.txtBgRed(pluginNames.length)} plugins: [${pluginNames.join(', ')}]`);

const omit = (obj, omitKeys) => {
    return Object.keys(obj).reduce((result, key) => {
      if(omitKeys.includes(key)) {
         result[key] = obj[key];
      }
      return result;
    }, {});
}

const omitByPluginsList = (list) => {
    plugins = omit(plugins, list);
}


const saveToFile = (str, fileName) => {

}

const buildPlaneText = (arr) => {

}

const buildLatexBibTemplate = (arr) => {

}

function exit() {
    process.exit(1);
}

 
program
  .option('-c, --count <countOfResults>', 'Count of results for single query request. By default: 10', 10)
  .option('-q --query <query>', `Query, which consists of keywords that are worth looking for, words are listed with a space, for phrases, spaces should be replaced with underscore, for example: "javascript how_node_js_is_work"`)
  .option('--using-plugins <pluginsString>', `List of required plugins names listed with a space, for example: "OReilly DuckDuckGo", if not provided, use all plugins by default`, omitByPluginsList)
  .option('--format-to-bibtex', 'Format output result to bibtex template')
  .option('--books-count <booksCount>', `Specify a count of results for book type per each single query request, '--sites-count' param required`)
  .option('--sites-count <sitesCount>', `Specify a count of results for site type per each single query request, '--books-count' param required`)
  .option('--books-count <booksQuery>', `Specify a count of results for book type per each single query request, '--sites-count' param required`)
  .option('--sites-count <sitesQuery>', `Specify a count of results for site type per each single query request, '--books-count' param required`)
  

program.parse(process.argv);

if (!program.query || (!program.sitesQuery && !program.booksQuery)) { console.log(`${Indicators.Error} 'query' parameters required`); exit() }

Object.keys(plugins).forEach(pluginName => {
    let pluginInstance = new plugins[pluginName](program.query, program.count);
    pluginInstance.parse().then(result => {
        program.formatToBibtex ? buildLatexBibTemplate(result) : buildPlaneText(result);
    })
})



//books.parse().then(result => { console.log(result); });
//let instance = new plugins["DuckDuckGo"]('how_javascript_work java blockchain');
//instance.parse().then(result => {console.log(result); });
//let books = new plugins["OReilly"]('javascript java blockchain', 3);

