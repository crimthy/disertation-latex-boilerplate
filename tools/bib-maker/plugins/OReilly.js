const BibTypes = require('./types')
const request = require('sync-request');
const cheerio = require('cheerio')
const { BookDetails } = require('./types-structures');
const { Indicators, defaultBackgroundTextStyles } = require('./utils');

const resultsPerPage = 16;
const chromeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';

const pluginName = 'OReillySearch';

const formatedLogHeader = () => {
    return `[${defaultBackgroundTextStyles.txtBgBlue(pluginName)}]:`;
}

const concatenator='+';
const requestMarksMap = Object.freeze({
    query: '#{{query}}',
    pageNumber: '#{{pageNumber}}'
});
const endpoint = `https://ssearch.oreilly.com/?i=1;page=${requestMarksMap.pageNumber};q=${requestMarksMap.query};q1=Books;x1=t1&act=pg_${requestMarksMap.pageNumber}`;

String.prototype.replaceAll = function (target, value) {
    let str = this;
    return str.replace(new RegExp(target,'g'), value);
}

function makeRequest(url) {
    const options = {
        headers: {
            'User-Agent': chromeUserAgent
        }
    };
    const body = request('GET', url, options).getBody();
    return body;
}

function parsePage(url, query, requiredCount) {
    const body = makeRequest(url);
    const result = parseResponse(body, query, requiredCount);
    return result;
}

function parseResponse(body, query, requiredCount) {
    const $ = cheerio.load(body);
    const notFound = $(".fsxl");
    let result = [];
    if (notFound.length){ console.log(`${Indicators.Error} ${formatedLogHeader()} Can't found any book for "${query}" request`); return; }
    const countLabel =  $(".bread_crumb").contents().first().text();
    const findedNumberMatch = countLabel.match(/\s.\d+/);
    const findedNumber = new Number(findedNumberMatch[0]);
    const requiredPages = calculatePagesCount(findedNumber, requiredCount);
    for (let i = 1; i <= requiredPages; i++) {
        const url = endpoint.replaceAll(requestMarksMap.pageNumber, i).replaceAll(requestMarksMap.query, query);
        const books = scrapePage(url, requiredPages === i ? 
            requiredCount < resultsPerPage ? requiredCount : requiredCount - (i * resultsPerPage) :
            resultsPerPage);
        result = result.concat(books);
    }
    return result;
}

const cheerioObject = (html) => {
    return cheerio.load(html);
}

function scrapePage(url, count) {
    let result = []; 
    const body = makeRequest(url);
    const $ = cheerioObject(body);
    $(".result").each(function (i, item) {
        if ( i >= count ) return;
        const target = cheerioObject($(item).html());
        const link = target(".learn-more").attr("href");
        console.log(`${Indicators.Info} ${formatedLogHeader()} Processing ${link}`);
        const details = scrapeDetails(link);
        result.push(details);
    });
    return result;
}

function scrapeDetails(url) {
    const body = makeRequest(url);
    const $ = cheerioObject(body);

    const replaceStrong = (str) => {
        return str.replace(/^<strong>.*strong> /g, '');
    }

    const name = $("#product-title").text();
    let author = [];
    $(".authors > a").each(function (i, item) {
        const target = cheerioObject($(item).html());
        author.push(target.text())
    })
    author = author.join(", ").replace(/\s\s+/g, ' ');
    let publisher = '',
        releaseDate = '',
        pages = '';
    $("#publisher-release-length > p").each(function (i, item) {
        const target = $(item).html();
        switch(i) {
            case 0:
                const indicator = cheerioObject(target);
                publisher = indicator("a").text();
                break;
            case 1:
                releaseDate = replaceStrong(target);
                break;
            case 2:
                pages = replaceStrong(target);
                break; 
        }
    });
    const bookDetails = new BookDetails(name, author, publisher, releaseDate, pages);
    return bookDetails;
}


const calculatePagesCount = (findedCount, requiredCount) => {
    if (findedCount < requiredCount) {
        console.log(`${Indicators.Warning} ${formatedLogHeader()} Found less than necessary ${findedCount} < ${requiredCount}`);
        return calculatePagesCount(findedCount, findedCount);
    } 
    const requiredPages = Math.ceil(requiredCount / resultsPerPage);
    return requiredPages;
}

class OReillySearch {
    constructor(searchQuery, requiredCount) {
        this.searchQuery = searchQuery.split(' ').map(item => item.replace('_',concatenator));
        this.requiredCount = requiredCount;
        this.result = [];
    }

    static type() {
        return BibTypes.book.type;
    }

    async parse() {
        this.searchQuery.forEach((query) => {
            console.log(`${Indicators.Info} ${formatedLogHeader()} Starting process query :'${query}' for OReilly parser`);
            const url = endpoint.replaceAll(requestMarksMap.pageNumber, '1').replaceAll(requestMarksMap.query, query);
            const result = parsePage(url, query, this.requiredCount);
            this.result = this.result.concat(result);
            console.log(`${Indicators.Ok} ${formatedLogHeader()} Query '${query}' for OReilly parser succesfully processed`);
        });
        return this.result;
    }
}

module.exports = OReillySearch;
