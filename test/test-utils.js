/**
 * Function inspired by https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html, tagName) {
    document.body.innerHTML = html;
    var node = document.querySelector(tagName);
    return node;
}

module.exports = { htmlToElement };
