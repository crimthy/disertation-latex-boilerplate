const bookTypeProcessor = (data) => {
    return null;
}

const siteTypeProcessor = (data) => {
    return null;
}

const BiBTypes = Object.freeze({
    "book": {
        processor: bookTypeProcessor,
        type: "book"
    }, 
    "site": { 
        processor: siteTypeProcessor,
        type: "site"
    }
});

module.exports = BiBTypes;