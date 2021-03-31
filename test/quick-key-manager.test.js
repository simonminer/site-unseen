const QuickKeyManager = require("../lib/quick-key-manager.js").QuickKeyManager;

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

describe("QuickKeyManager class tests", function () {
    test('constructor creates object', () => {
        var qkm = new QuickKeyManager();
        expect(qkm instanceof QuickKeyManager).toBe(true);
    });
});