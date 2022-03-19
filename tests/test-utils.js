const regeneratorRuntime = require("regenerator-runtime");

/**
 * Create an HTMLElement object for the first
 * instace of the `tagName` tag in an HTML string.
 * Inspired by https://stackoverflow.com/a/494348/2171535
 * @param {String} html - HTML representing a single element.
 * @param {String} tagName - Name of tag to parse into an HTMLElement.
 * @return {Element}
 */
function htmlToElement(html, tagName) {
    document.body.innerHTML = html;
    var node = document.querySelector(tagName);
    return node;
}

/**
 * Sleep fo the specified number of miliseconds
 * Inspired by https://stackoverflow.com/a/39914235/2171535.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { htmlToElement, sleep };
