const Caption = require('../modules/caption.js').Caption;
const NodeParser = require('../modules/node-parser.js').NodeParser;

const id = 'caption';
const sep = ': ';

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
});

describe('Caption class tests', function () {
    test('constructor creates caption', () => {
        expect(caption instanceof Caption).toBe(true);
        expect(caption.id).toBe(id);
        expect(caption.separator).toBe(sep);
        expect(caption.nodeParser instanceof NodeParser).toBe(true);
        expect(caption.node).toBe(undefined);
    });

    test('generateText returns accessible description of node', () => {
        expect(caption.generateText(document.querySelector('h1'))).toBe(
            `heading level 1${sep}Page heading`
        );
        expect(caption.generateText(document.querySelector('a'))).toBe(
            `link${sep}This is a link.`
        );
        expect(caption.generateText(document.querySelector('div'))).toBe(
            `Image Description`
        );
        expect(caption.generateText(document.querySelector('span'))).toBe(
            `Image Description`
        );
        expect(caption.generateText(document.querySelector('img'))).toBe(
            `img${sep}Image Description`
        );
        expect(caption.generateText(document.querySelector('p'))).toBe(
            `This is a paragraph.`
        );
    });

    test('update sets caption node text', () => {
        caption.node = document.createElement('div');
        caption.update(document.querySelector('h1'));
        expect(caption.node.innerHTML).toBe(
            `heading level 1${sep}Page heading`
        );
        caption.update(document.querySelector('a'));
        expect(caption.node.innerHTML).toBe(`link${sep}This is a link.`);
    });

    test('getCSS() creates <style> element', () => {
        var style = caption.getCSS();
        expect(style instanceof Element).toBe(true);
        expect(style.tagName.toLowerCase()).toBe('style');
    });

    test('getHTML() creates <div> element', () => {
        var div = caption.getHTML();
        expect(div instanceof Element).toBe(true);
        expect(div.tagName.toLowerCase()).toBe('div');
        expect(div.getAttribute('id')).toBe(caption.id);
        expect(caption.node).toBe(div);
    });
});
