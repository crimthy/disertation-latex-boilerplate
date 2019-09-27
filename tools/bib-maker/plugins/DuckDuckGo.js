const BibTypes = require('./types');
const request = require('sync-request');
const cheerio = require('cheerio');
const { SiteDetails  } = require('./types-structures');
const puppeteer = require('puppeteer');
const { Indicators, defaultBackgroundTextStyles } = require('./utils');

const concatenator=' ';

const endpoint = `https://duckduckgo.com`;
const chromeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';

const pluginName = 'DuckDuckGoSearch';

const formatedLogHeader = () => {
    return `[${defaultBackgroundTextStyles.txtBgMagenta(pluginName)}]:`;
}

function buildDetailes(links) {
    let result = [];
    links.forEach(url => {
        console.log(`${Indicators.Info} ${formatedLogHeader()} Processing ${url}`);
        const body = makeRequest(url);
        const $ = cheerio.load(body);
        let title = $("title").text().replace(/\n/g, '').replace(/\s\s+/g, '');
        result.push(new SiteDetails(title, url));
    });
    return result;
}

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

async function exec(searchQuery, requiredCount) {
    let result = [];
    const browser = await puppeteer.launch({ headless: true });
    try {
        const [page] = await browser.pages();
        await page.goto(endpoint);
        await page.type('#search_form_input_homepage', searchQuery, {delay: 20})
        const element = await page.$('#search_button_homepage');
        await element.click();
        await page.waitForNavigation();
        
        let links = await page.evaluate(function () {
            let elements = document.querySelectorAll(".result__a");
            let values = [];
            for(let i = 0; i < elements.length; i++)
                values.push(elements[i].href);
            return values;
        });
        if (requiredCount < links.length) {
            result = result.concat(buildDetailes(links.slice(0,requiredCount)));
            return result;
        }
        while (requiredCount > 0) {
            requiredCount -= links.length;
            if (requiredCount < 0)
                break;
            result = result.concat(buildDetailes(links));

            // clear links
            await page.evaluate(function (){
                let toDelete = document.querySelectorAll(".results_links_deep");
                for(let i=0; i< toDelete.length; i++){
                    toDelete[i].parentNode.removeChild(toDelete[i]);
                }
                let nextPageBtn = document.querySelectorAll(".result--more__btn")[0];
                nextPageBtn.click();
            });
            
            await page.waitForSelector('.result--more__btn', {
                visible: true,
            });          

            links = await page.evaluate(function (){
                let elements = document.querySelectorAll(".result__a");
                let values = [];
                for(let i = 0; i < elements.length; i++)
                    values.push(elements[i].href);
                return values;
            });
        }
        const remainedPages = Math.abs(requiredCount);
        if (remainedPages != 0) {
            links = await page.evaluate(function () {
                let elements = document.querySelectorAll(".result__a");
                let values = [];
                for(let i = 0; i < elements.length; i++)
                    values.push(elements[i].href);
                return values;
            });
            result = result.concat(buildDetailes(links.slice(0, remainedPages)));
        }
        return result;
    }
    catch (e) {}
    finally {
        await browser.close();
    }
}


class DuckDuckGoSearch {
    constructor(searchQuery, requiredCount) {
        this.searchQuery = searchQuery.split(' ').map(item => item.replaceAll('_',concatenator));
        this.requiredCount = requiredCount;
        this.result = [];
    }

    get type() {
        return BibTypes.site.type;
    }

    async parse() {
        for (let query of this.searchQuery) {
            console.log(`${Indicators.Info} ${formatedLogHeader()} Starting process query :'${query}' for DuckDuckGo parser`);
            const result = await exec(query, this.requiredCount);
            this.result = this.result.concat(result);
            console.log(`${Indicators.Ok} ${formatedLogHeader()} Query '${query}' for DuckDuckGo parser succesfully processed`);
        }
        return this.result;
    }
}

module.exports = DuckDuckGoSearch;