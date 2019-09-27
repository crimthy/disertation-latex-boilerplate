const readline = require('readline');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const BibTypes = require('./plugins/types');
const { BookDetails, SiteDetails } = require('./plugins/types-structures');
const PluginsManager = require('./PluginsManager')
const { Indicators, Colors } = require('./utils');

let plugins = new PluginsManager().exports
let books = new plugins["OReilly"]('javascript java blockchain', 3);

const saveToFile = (str, fileName) => {

}

const buildPlaneText = (arr) => {

}

const buildLatexBibTemplate = (arr) => {

}

books.parse().then(result => { console.log(result); });
//let instance = new plugins["DuckDuckGo"]('how_javascript_work java blockchain');
//instance.parse().then(result => {console.log(result); });

