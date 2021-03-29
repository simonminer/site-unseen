const QuickKey = require("../lib/quick-key.js").QuickKey;

// One-time setup.
beforeAll(() => {
    document.body.innerHTML = `
<div id="content">
    <h1>Page heading</h1>
    <a href="test1"><Test 1</a>
    <p>This is a paragraph.</p>
    <a href="test1"><Test 2</a>
    <a href="test1"><Test 3</a>
    <span>Nothing special</span>
</div>
`;
});

describe("QuickKey class tests", function () {
    test('constructor sets properties', () => {
        const key = 'a';
        const selector = 'a';
        var quickKey = new QuickKey(key, selector);
        expect(quickKey instanceof QuickKey).toBe(true);
        expect(quickKey.key).toBe(key);
        expect(quickKey.selector).toBe(selector);
    });
});