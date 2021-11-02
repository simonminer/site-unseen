const TagParser = require("../modules/tag-parser.js").TagParser;

var tagParser = undefined;
beforeAll(() => {
    tagParser = new TagParser();
})

/**
 * Function inspired by https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html, tag) {
    document.body.innerHTML = html;
    var node = document.querySelector(tag);
    return node;
}

describe("TagParser class tests", function () {
    test('constructor creates tagParser', () => {
        expect(tagParser instanceof TagParser).toBe(true);
        expect(tagParser.separator).toBe(': ');
        expect(Object.keys(tagParser.tagsWithoutRole).length).toBeGreaterThan(0);
    });

    test('tagParser parses heading tags', () => {
        for (var i = 1; i <= 6; i++) {
            var tagName = `h${i}`;
            var tag =  htmlToElement(`<${tagName}>Heading level ${i}</${tagName}>`, tagName);
            var data = tagParser.parse(tag);
            expect(data.role).toBe('heading');
            expect(data.value).toBe(`Heading level ${i}`);

            tag =  htmlToElement(`<div role="heading" aria-level="${i}">Heading level ${i}</div>`, 'div');
            data = tagParser.parse(tag);
            expect(data.role).toBe('heading');
            expect(data.value).toBe(`Heading level ${i}`);
            
        }
    });
});
