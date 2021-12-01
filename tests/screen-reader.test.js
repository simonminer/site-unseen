const ScreenReader = require('../modules/screen-reader.js').ScreenReader;

var screenReader = undefined;
beforeEach(() => {
    document.body.innerHTML = `
    <div id="content">
        <h1>This is a heading</h1>
        <p>This is a paragraph.</p>
        <div><div>This is a nested div.</div></div>
        <input type="text" />
    </div>
    `;
    screenReader = new ScreenReader();
});

describe('ScreenReader class tests', function () {
    test('constructor creates screen reader object', () => {
        expect(screenReader instanceof ScreenReader).toBe(true);
        expect(screenReader.rootNode).toBe(document.body)
        expect(screenReader.navigator.nodes.length).toBeGreaterThan(0);
        expect(screenReader.shortcutKeyManager.shortcutKeys instanceof Map).toBe(true);
        expect(document.getElementById(screenReader.overlay.id)).toBeDefined();
        expect(document.getElementById(screenReader.caption.id)).toBeDefined();
        expect(screenReader.caption.nodeParser.rootNode).toBe(document.body);
        expect(Object.keys(screenReader.callbacks).length).toBeGreaterThan(0);
    });
    test('constructor stores screen reader in DOM', () => {
        expect(ScreenReader.get()).toBe(screenReader);
    });
    test('setApplicationRoleOnChildren adds role="application" attribute to children', () => {
        screenReader.setApplicationRoleOnChildren();
        var children = document.body.children;
        for (var i = 0, l = children.length; i < l; i++) {
            expect(children[i].getAttribute('role')).toBe('application');
        }
    });
    test('moveTo sets currently active node', () => {
        var node = document.querySelector('h1');
        screenReader.moveTo(node);
        expect(document.activeElement).toBe(node);
        expect(screenReader.navigator.currentNode()).toBe(node);
        expect(screenReader.caption.node.innerHTML).toBe(screenReader.caption.generateText(node));
    });
});
