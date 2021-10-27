const ShortcutKey = require("../modules/shortcut-key.js").ShortcutKey;

// One-time setup.
const key = 'a';
const selector = 'a';
var shortcutKey = new ShortcutKey(key, selector);

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
    shortcutKey = new ShortcutKey(key, selector, document.body);
});

describe("ShortcutKey class tests", function () {
    test('constructor sets properties', () => {
        expect(shortcutKey instanceof ShortcutKey).toBe(true);
        expect(shortcutKey.key).toBe(key);
        expect(shortcutKey.selector).toBe(selector);
        expect(shortcutKey.nodes.length).toBeGreaterThan(0);
        expect(shortcutKey.wrappedTo).toBe(undefined);
    });
    test('findNodes populates nodes list', () => {
        var nodes = shortcutKey.findNodes('a', document.body);
        expect(nodes.length).toBeGreaterThan(0);
        nodes.forEach(node => {
            expect(node.nodeName).toBe(shortcutKey.selector.toUpperCase());
        });
    });
    test('constructor with root node loads node list', () => {
        shortcutKey = new ShortcutKey(key, selector, document.body);
        expect(shortcutKey instanceof ShortcutKey).toBe(true);
        expect(shortcutKey.key).toBe(key);
        expect(shortcutKey.selector).toBe(selector);
        expect(shortcutKey.nodes.length).toBeGreaterThan(0);
        shortcutKey.nodes.forEach(node => {
            expect(node.nodeName).toBe(shortcutKey.selector.toUpperCase());
        });
    });
    
    test('currentNode returns undefined in current node index < 0', () => {
        shortcutKey.currentNodeIndex = -1;
        expect(shortcutKey.currentNode()).toBe(undefined);
    });
    test('currentNode returns current match for each node in the list', () => {
        for (let index = 0; index < shortcutKey.nodes.length - 1; index++) {
            shortcutKey.nextNode();
            expect(shortcutKey.currentNode()).toBe(shortcutKey.nodes[index]);
        }
    });
    test('currentNode returns undefined for empty node list', () => {
        shortcutKey = new ShortcutKey( 'test', 'test', document.body);
        expect(shortcutKey.nodes.length).toEqual(0);
        expect(shortcutKey.currentNode()).toBe(undefined);
    });

    test('nextNode returns first match if current node index < 0', () => {
        shortcutKey.currentNodeIndex = -1;
        expect(shortcutKey.nextNode()).toBe(shortcutKey.nodes[0]);
        expect(shortcutKey.wrappedTo).toBe(undefined);
    });
    test('nextNode returns next match for each node in the list before the last one', () => {
        for (let index = 0; index < shortcutKey.nodes.length - 2; index++) {
            shortcutKey.currentNodeIndex = index;
            expect(shortcutKey.nextNode()).toBe(shortcutKey.nodes[index + 1]);
            expect(shortcutKey.wrappedTo).toBe(undefined);
        }
    });
    test('nextNode returns first match for last node in list', () => {
        shortcutKey.currentNodeIndex = shortcutKey.nodes.length - 1;
        expect(shortcutKey.nextNode()).toBe(shortcutKey.nodes[0]);
        expect(shortcutKey.wrappedTo).toBe("start");
    });
    test('nextNode returns the only match in the list', () => {
        shortcutKey = new ShortcutKey( 'div', 'div', document.body);
        expect(shortcutKey.nodes.length).toEqual(1);
        expect(shortcutKey.nextNode()).toBe(shortcutKey.nodes[0]);
        expect(shortcutKey.nextNode()).toBe(shortcutKey.nodes[0]);
    });
    test('nextNode returns undefined for empty node list', () => {
        shortcutKey = new ShortcutKey( 'test', 'test', document.body);
        expect(shortcutKey.nodes.length).toEqual(0);
        expect(shortcutKey.nextNode()).toBe(undefined);
        expect(shortcutKey.wrappedTo).toBe(undefined);
    });

    test('previousNode returns last match if current node index < 0', () => {
        shortcutKey.currentNodeIndex = -1;
        expect(shortcutKey.previousNode()).toBe(shortcutKey.nodes[shortcutKey.nodes.length - 1]);
        expect(shortcutKey.wrappedTo).toBe("end");
    });
    test('previousNode returns previous match for each node in the list after the first one', () => {
        for (let index = shortcutKey.nodes.length - 1; index > 0; index--) {
            shortcutKey.currentNodeIndex = index;
            expect(shortcutKey.previousNode()).toBe(shortcutKey.nodes[index - 1]);
            expect(shortcutKey.wrappedTo).toBe(undefined);
        }
    });
    test('previousNode returns last match for first node in list', () => {
        shortcutKey.currentNodeIndex = 0
        expect(shortcutKey.previousNode()).toBe(shortcutKey.nodes[shortcutKey.nodes.length - 1]);
        expect(shortcutKey.wrappedTo).toBe("end");
    });    
    test('previousNode returns the only match in the list', () => {
        shortcutKey = new ShortcutKey( 'div', 'div', document.body);
        expect(shortcutKey.nodes.length).toEqual(1);
        expect(shortcutKey.previousNode()).toBe(shortcutKey.nodes[0]);
        expect(shortcutKey.previousNode()).toBe(shortcutKey.nodes[0]);
        expect(shortcutKey.wrappedTo).toBe(undefined);
    });
    test('previousNode returns undefined for empty node list', () => {
        shortcutKey = new ShortcutKey( 'test', 'test', document.body);
        expect(shortcutKey.nodes.length).toEqual(0);
        expect(shortcutKey.previousNode()).toBe(undefined);
        expect(shortcutKey.wrappedTo).toBe(undefined);
    });
});
