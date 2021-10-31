const ShortcutKeyManager = require("../modules/shortcut-key-manager.js").ShortcutKeyManager;
const ScreenReader = require("../modules/screen-reader.js").ScreenReader;;

// One-time setup.
beforeAll(() => {
    document.body.innerHTML = `
<div id="content">
    <header>
        <h1>Page heading</h1>
    </header>
    <a href="test1">Test 1</a>
    <ul>
        <li>First</li>
        </li>Second</li>
    </ul>
    <p>This is a paragraph.</p>
    <h2>Subheading</h2>
    <a href="test2">Test 2</a>
    <h3>Sub-subheading</h3>
    <a href="test3">Test 3</a>
    <span>Nothing special</span>
    <h2>Subheading</h2>
    <a href="test4">Test 4</a>
    <input type="text" name ="name" />
</div>
`;
});

afterEach(() => {
    document.shortcutKeyManager = undefined;
    document.removeEventListener("keydown", ShortcutKeyManager.eventHandlerFunction);
});

const keyData = {
    'h': 'h1, h2, h3',
    'l': 'a',
    'z': 'foo'
};

// Test function for shortcut keys.
function returnTrue() {
    return true;
}

describe("ShortcutKeyManager class tests", function () {
    test('constructor sets up shortcut keys map', () => {
        var skm = new ShortcutKeyManager(document.getElementById('content'));
        expect(skm instanceof ShortcutKeyManager).toBe(true);
        expect(typeof skm.shortcutKeyFunction).toBe("function");
        expect(skm.shortcutKeys.size).toBe(Object.keys(skm.defaultShortcutKeyData).length - 1);
        skm.shortcutKeys.forEach( (value, key) => {
            expect(value.selector).toBe(skm.defaultShortcutKeyData[key]);
        });
        expect(skm.shortcutKeys.has('z')).toBe(false);
    });
    test('this.createShortcutKeyMap overrides shortcut key map', () => {
        var skm = new ShortcutKeyManager(document.getElementById('content'), keyData);
        expect(skm instanceof ShortcutKeyManager).toBe(true);
        expect(typeof skm.shortcutKeyFunction).toBe("function");
        expect(skm.shortcutKeys.size).toBe(Object.keys(keyData).length - 1);
        skm.shortcutKeys.forEach( (value, key) => {
            expect(value.selector).toBe(keyData[key]);
        });
        expect(skm.shortcutKeys.has('z')).toBe(false);
        const map = skm.createShortcutKeyMap(keyData, document.getElementById('content'));
        expect(map.size).toBe(Object.keys(keyData).length - 1);
        map.forEach( (value, key) => {
            expect(value.selector).toBe(keyData[key]);
        });
        expect(map.has('z')).toBe(false);
    });
    test('bindShortcutKeysToFunction sets up event listener', () => {
        var skm = new ShortcutKeyManager(document.getElementById('content'), keyData);
        expect(skm.bindShortcutKeysToFunction(returnTrue)).toBe(true);
        expect(skm.shortcutKeyFunction).toBe(returnTrue);
        new ScreenReader();
        expect(typeof ScreenReader.get().shortcutKeyManager).toBe("object");
        expect(ScreenReader.get().shortcutKeyManager.shortcutKeys instanceof Map).toBe(true);
    });
    test('constructor sets up shortcut keys map and event listener', () => {
        var skm = new ShortcutKeyManager(document.getElementById('content'), keyData, returnTrue);
        expect(skm instanceof ShortcutKeyManager).toBe(true);
        expect(skm.shortcutKeys.size).toBe(Object.keys(keyData).length - 1);
        skm.shortcutKeys.forEach( (value, key) => {
            expect(value.selector).toBe(keyData[key]);
        });
        expect(skm.shortcutKeys.has('z')).toBe(false);
        expect(skm.shortcutKeyFunction).toBe(returnTrue);
        new ScreenReader();
        expect(typeof ScreenReader.get().shortcutKeyManager).toBe("object");
        expect(ScreenReader.get().shortcutKeyManager.shortcutKeys instanceof Map).toBe(true);
    });


});
