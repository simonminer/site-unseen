const QuickKeyManager = require("../modules/quick-key-manager.js").QuickKeyManager;

// One-time setup.
beforeAll(() => {
    document.body.innerHTML = `
<div id="content">
    <h1>Page heading</h1>
    <a href="test1">Test 1</a>
    <p>This is a paragraph.</p>
    <h2>Subheading</h2>
    <a href="test2">Test 2</a>
    <h3>Sub-subheading</h3>
    <a href="test3">Test 3</a>
    <span>Nothing special</span>
    <h2>Subheading</h2>
    <a href="test4">Test 4</a>
</div>
`;
});

afterEach(() => {
    document.quickKeyManager = undefined;
    document.removeEventListener("keydown", QuickKeyManager.eventHandler);
});

const keyData = {
    'h': 'h1, h2, h3',
    'l': 'a',
    'z': 'foo'
};

// Test function for quick keys.
function returnTrue() {
    return true;
}

describe("QuickKeyManager class tests", function () {
    test('constructor sets up quick keys map', () => {
        var qkm = new QuickKeyManager(keyData, document.getElementById('content'));
        expect(qkm instanceof QuickKeyManager).toBe(true);
        expect(qkm.quickKeys.size).toBe(Object.keys(keyData).length - 1);
        qkm.quickKeys.forEach( (value, key) => {
            expect(value.selector).toBe(keyData[key]);
        });
        expect(qkm.quickKeys.has('z')).toBe(false);
    });
    test('bindQuickKeysToFunction sets up event listener', () => {
        var qkm = new QuickKeyManager(keyData, document.getElementById('content'));
        expect(qkm.bindQuickKeysToFunction(returnTrue)).toBe(true);
        expect(typeof document.quickKeyManager).toBe("object");
        expect(document.quickKeyManager.quickKeys instanceof Map).toBe(true);
    });
    test('constructor sets up quick keys map and event listener', () => {
        var qkm = new QuickKeyManager(keyData, document.getElementById('content'), returnTrue);
        expect(qkm instanceof QuickKeyManager).toBe(true);
        expect(qkm.quickKeys.size).toBe(Object.keys(keyData).length - 1);
        qkm.quickKeys.forEach( (value, key) => {
            expect(value.selector).toBe(keyData[key]);
        });
        expect(qkm.quickKeys.has('z')).toBe(false);
        expect(typeof document.quickKeyManager).toBe("object");
        expect(document.quickKeyManager.quickKeys instanceof Map).toBe(true);
    });


});