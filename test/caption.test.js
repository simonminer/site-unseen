const Caption = require("../modules/caption.js").Caption;
const NodeParser = require("../modules/node-parser.js").NodeParser;

const id = "caption";
const sep = ": ";

beforeAll(() => {
    document.body.innerHTML = `
<h1>Page heading</h1>
<a href="test1">This is a link.</a>
<div>
    <span>
        <img src="image.jpg" alt="Image Description" />
    </span>
</div>
<p>This is a paragraph.</p>
`;
});
var caption = undefined;
beforeEach(() => {
    caption = new Caption();
})

describe("Caption class tests", function () {
    test('constructor creates caption', () => {
        expect(caption instanceof Caption).toBe(true);
        expect(caption.id).toBe(id);
        expect(caption.separator).toBe(sep);
        expect(caption.nodeParser instanceof NodeParser).toBe(true);
        expect(caption.node).toBe(undefined);
    });

    test('generate returns accessible description of node', () => {
        expect(caption.generate(document.querySelector("h1"))).toBe(`heading level 1${sep}Page heading`);
        expect(caption.generate(document.querySelector("a"))).toBe(`link${sep}This is a link.`);
        expect(caption.generate(document.querySelector("div"))).toBe(`Image Description`);
        expect(caption.generate(document.querySelector("span"))).toBe(`Image Description`);
        expect(caption.generate(document.querySelector("img"))).toBe(`img${sep}Image Description`);
        expect(caption.generate(document.querySelector("p"))).toBe(`This is a paragraph.`);
    });

    test('getCSS() creates <style> element', () => {
        var style = caption.getCSS();
        expect(style instanceof Element).toBe(true);
        expect(style.tagName.toLowerCase()).toBe("style");
    });

    test('getHTML() creates <div> element', () => {
        var div = caption.getHTML();
        expect(div instanceof Element).toBe(true);
        expect(div.tagName.toLowerCase()).toBe("div");
        expect(div.getAttribute("id")).toBe(caption.id);
        expect(caption.node).toBe(div);
    });

});
