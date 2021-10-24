const QuickKey = require("../modules/quick-key.js").QuickKey;

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

beforeEach(() => {
    quickKey = new QuickKey(key, selector, document.body);
});

describe("QuickKey class tests", function () {
    test('constructor sets properties', () => {
        expect(quickKey instanceof QuickKey).toBe(true);
        expect(quickKey.key).toBe(key);
        expect(quickKey.selector).toBe(selector);
        expect(quickKey.nodes.length).toBeGreaterThan(0);
        expect(quickKey.wrappedTo).toBe(undefined);
    });
    test('findNodes populates nodes list', () => {
        var nodes = quickKey.findNodes('a', document.body);
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
    
    test('currentNode returns undefined in current node index < 0', () => {
        quickKey.currentNodeIndex = -1;
        expect(quickKey.currentNode()).toBe(undefined);
    });
    test('currentNode returns current match for each node in the list', () => {
        for (let index = 0; index < quickKey.nodes.length - 1; index++) {
            quickKey.nextNode();
            expect(quickKey.currentNode()).toBe(quickKey.nodes[index]);
        }
    });
    test('currentNode returns undefined for empty node list', () => {
        quickKey = new QuickKey( 'test', 'test', document.body);
        expect(quickKey.nodes.length).toEqual(0);
        expect(quickKey.currentNode()).toBe(undefined);
    });

    test('nextNode returns first match if current node index < 0', () => {
        quickKey.currentNodeIndex = -1;
        expect(quickKey.nextNode()).toBe(quickKey.nodes[0]);
        expect(quickKey.wrappedTo).toBe(undefined);
    });
    test('nextNode returns next match for each node in the list before the last one', () => {
        for (let index = 0; index < quickKey.nodes.length - 2; index++) {
            quickKey.currentNodeIndex = index;
            expect(quickKey.nextNode()).toBe(quickKey.nodes[index + 1]);
            expect(quickKey.wrappedTo).toBe(undefined);
        }
    });
    test('nextNode returns first match for last node in list', () => {
        quickKey.currentNodeIndex = quickKey.nodes.length - 1;
        expect(quickKey.nextNode()).toBe(quickKey.nodes[0]);
        expect(quickKey.wrappedTo).toBe("start");
    });
    test('nextNode returns the only match in the list', () => {
        quickKey = new QuickKey( 'div', 'div', document.body);
        expect(quickKey.nodes.length).toEqual(1);
        expect(quickKey.nextNode()).toBe(quickKey.nodes[0]);
        expect(quickKey.nextNode()).toBe(quickKey.nodes[0]);
    });
    test('nextNode returns undefined for empty node list', () => {
        quickKey = new QuickKey( 'test', 'test', document.body);
        expect(quickKey.nodes.length).toEqual(0);
        expect(quickKey.nextNode()).toBe(undefined);
        expect(quickKey.wrappedTo).toBe(undefined);
    });

    test('previousNode returns last match if current node index < 0', () => {
        quickKey.currentNodeIndex = -1;
        expect(quickKey.previousNode()).toBe(quickKey.nodes[quickKey.nodes.length - 1]);
        expect(quickKey.wrappedTo).toBe("end");
    });
    test('previousNode returns previous match for each node in the list after the first one', () => {
        for (let index = quickKey.nodes.length - 1; index > 0; index--) {
            quickKey.currentNodeIndex = index;
            expect(quickKey.previousNode()).toBe(quickKey.nodes[index - 1]);
            expect(quickKey.wrappedTo).toBe(undefined);
        }
    });
    test('previousNode returns last match for first node in list', () => {
        quickKey.currentNodeIndex = 0
        expect(quickKey.previousNode()).toBe(quickKey.nodes[quickKey.nodes.length - 1]);
        expect(quickKey.wrappedTo).toBe("end");
    });    
    test('previousNode returns the only match in the list', () => {
        quickKey = new QuickKey( 'div', 'div', document.body);
        expect(quickKey.nodes.length).toEqual(1);
        expect(quickKey.previousNode()).toBe(quickKey.nodes[0]);
        expect(quickKey.previousNode()).toBe(quickKey.nodes[0]);
        expect(quickKey.wrappedTo).toBe(undefined);
    });
    test('previousNode returns undefined for empty node list', () => {
        quickKey = new QuickKey( 'test', 'test', document.body);
        expect(quickKey.nodes.length).toEqual(0);
        expect(quickKey.previousNode()).toBe(undefined);
        expect(quickKey.wrappedTo).toBe(undefined);
    });
});