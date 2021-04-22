const Caption = require("../modules/caption.js").Caption;

const id = "caption";
const textColor = '#000000';
const backgroundColor = '#ffffff';
const borderColor = '#00000';
const borderWidth = "3 px";
const sep = ": ";

var caption = undefined;
beforeAll(() => {
    caption = new Caption({
        textColor: textColor,
        backgroundColor: backgroundColor,
        borderColor: borderColor
    });

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

describe("Caption class tests", function () {
    test('constructor creates caption', () => {
        expect(caption instanceof Caption).toBe(true);
        expect(caption.id).toBe(id);
        expect(caption.textColor).toBe(textColor);
        expect(caption.backgroundColor).toBe(backgroundColor);
        expect(caption.borderColor).toBe(borderColor);
        expect(caption.borderWidth).toBe(borderWidth);
        expect(caption.separator).toBe(sep);
    });

    test('generate returns accessible description of node', () => {
        expect(caption.generate(document.querySelector("h1"))).toBe(`heading${sep}Page heading`);
        expect(caption.generate(document.querySelector("a"))).toBe(`link${sep}This is a link.`);
        expect(caption.generate(document.querySelector("div"))).toBe(`Image Description`);
        expect(caption.generate(document.querySelector("span"))).toBe(`Image Description`);
        expect(caption.generate(document.querySelector("img"))).toBe(`img${sep}Image Description`);
        expect(caption.generate(document.querySelector("p"))).toBe(`This is a paragraph.`);
    });
});