const { Indicators } = require('./utils');
const sitePattern = `#{{title}} [Електронний ресурс] – Режим доступу до ресурсу: #{{url}}`
const bookPattern = `#{{name}} / #{{author}} // #{{publisher}}, – #{{releaseDate}}. – #{{pages}}.`;

const rnd = (min, max)  => {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

const randomizePages = (pagesCount) => {
    const skip = 15
    if (pagesCount < skip) { console.log (`${Indicators.Error} Is it really book? Make your random pages by yourself`); return '';}
    const skipIntroPages = pagesCount - skip;
    const selectedPart = Math.floor(Math.random() * 3) + 1;
    const partSize = skipIntroPages / 3;
    const maxTo = selectedPart * partSize;
    const minTo = maxTo - partSize;
    let from = rnd(minTo, maxTo - (partSize / 2)) + skip,
        to = rnd(minTo + (partSize / 2), maxTo) + skip;  
    return `C. ${from}–${to}`;
}

class BookDetails {
    constructor(name, author, publisher, releaseDate, pages) {
        this.name = name;
        this.author = author;
        this.publisher = publisher;
        this.releaseDate = releaseDate;
        this.pages = pages;
    }

    toPrintableString() {
        return bookPattern.
            replace('#{{name}}',this.name).
            replace('#{{author}}',this.author).
            replace('#{{publisher}}',this.publisher).
            replace('#{{releaseDate}}',this.releaseDate).
            replace('#{{pages}}',randomizePages(this.pages));
    }
}

class SiteDetails {
    constructor(title, url) {
        this.title = title;
        this.url = url;
    }

    toPrintableString() {
        return sitePattern.
            replace('#{{title}}',this.title).
            replace('#{{url}}',this.url);
    }
}

module.exports = {
    BookDetails: BookDetails,
    SiteDetails: SiteDetails
}