const ScreenReader = require('../src/modules/screen-reader.js').ScreenReader;
const Overlay = require('../src/modules/overlay.js').Overlay;
const Caption = require('../src/modules/caption.js').Caption;
const HelpContent = require('../src/modules/help-content.js').HelpContent;

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
        expect(screenReader.rootNode).toBe(document.body);
        expect(screenReader.navigator.nodes.length).toBeGreaterThan(0);
        expect(
            screenReader.shortcutKeyManager.shortcutKeys instanceof Map
        ).toBe(true);
        expect(document.getElementById(screenReader.overlay)).toBeDefined();
        expect(document.getElementById(screenReader.caption)).toBeDefined();
        expect(document.getElementById(screenReader.helpContent)).toBeDefined();
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
        expect(screenReader.moveTo()).toBe(undefined);
        expect(screenReader.navigator.currentNode()).toBe(undefined);
        expect(screenReader.caption.node.innerHTML).toBe('');

        var node = document.querySelector('h1');
        screenReader.moveTo(node);
        expect(document.activeElement).toBe(node);
        expect(screenReader.navigator.currentNode()).toBe(node);
        expect(screenReader.caption.node.innerHTML).toBe(
            screenReader.caption.generateText(node)
        );
    });

    test('isNavigationActive is based on overlay and help content visibility', () => {
        expect(screenReader.isNavigationActive()).toBe(true);
        screenReader.overlay.hide();
        expect(screenReader.isNavigationActive()).toBe(false);
        screenReader.overlay.show();
        expect(screenReader.isNavigationActive()).toBe(true);
        screenReader.helpContent.show(screenReader);
        expect(screenReader.isNavigationActive()).toBe(false);
        screenReader.helpContent.hide(screenReader);
        expect(screenReader.isNavigationActive()).toBe(true);
    });

    test('cleanUp removes screen reader DOM elments, classes and attributes', () => {
        const navigator = screenReader.navigator;
        const className = navigator.className;
        expect(document.querySelectorAll(`.${className}`).length).toBe(
            navigator.nodes.length
        );
        expect(document.querySelectorAll(`[tabindex="-1"]`).length).toBe(
            navigator.tabIndexNodes.length
        );
        expect(document.querySelectorAll(`#${HelpContent.id}`).length).toBe(1);
        expect(document.querySelectorAll(`#${Caption.id}`).length).toBe(1);
        expect(document.querySelectorAll(`#${Overlay.id}`).length).toBe(1);
        screenReader.cleanUp();
        expect(document.querySelectorAll(`.${className}`).length).toBe(0);
        expect(document.querySelectorAll(`[tabindex="-1"]`).length).toBe(0);
        expect(document.querySelectorAll(`#${HelpContent.id}`).length).toBe(0);
        expect(document.querySelectorAll(`#${Caption.id}`).length).toBe(0);
        expect(document.querySelectorAll(`#${Overlay.id}`).length).toBe(0);
    });
});
