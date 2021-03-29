const QuickKey = require("../lib/quick-key.js").QuickKey;

// One-time setup.
const key = 'a';
const selector = 'a';
var quickKey = new QuickKey(key, selector);

beforeAll(() => {
    document.body.innerHTML = `
<div id="content">
    <h1>Page heading</h1>
    <a href="test1">Test 1</a>
    <p>This is a paragraph.</p>
    <a href="test1">Test 2</a>
    <a href="test1">Test 3</a>
    <span>Nothing special</span>
</div>
`;
});

describe("QuickKey class tests", function () {
    test('constructor sets properties', () => {
        expect(quickKey instanceof QuickKey).toBe(true);
        expect(quickKey.key).toBe(key);
        expect(quickKey.selector).toBe(selector);
        expect(quickKey.nodes.length).toEqual(0);
    });
    test('findNodes populates nodes list', () => {
        var nodes = quickKey.findNodes(document.body);
        expect(nodes.length).toBeGreaterThan(0);
        nodes.forEach(node => {
            expect(node.nodeName).toBe(quickKey.selector.toUpperCase());
        });
    });
    test('constructor with root node loads node list', () => {
        quickKey = new QuickKey(key, selector, document.body);
        expect(quickKey instanceof QuickKey).toBe(true);
        expect(quickKey.key).toBe(key);
        expect(quickKey.selector).toBe(selector);
        expect(quickKey.nodes.length).toBeGreaterThan(0);
        quickKey.nodes.forEach(node => {
            expect(node.nodeName).toBe(quickKey.selector.toUpperCase());
        });
    });
    
});