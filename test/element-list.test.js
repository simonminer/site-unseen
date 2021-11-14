const ElementList = require("../modules/element-list.js").ElementList;

// One-time setup.
const selector = "a";
var nodeList = new ElementList(selector);

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
    nodeList = new ElementList(selector, document.body);
});

describe("ElementList class tests", function () {

    test('constructor sets properties', () => {
        nodeList = new ElementList();
        expect(nodeList instanceof ElementList).toBe(true);
        expect(nodeList.nodes.length).toBe(0);
        expect(nodeList.currentNodeIndex).toBe(-1);
        expect(nodeList.wrappedTo).toBe(undefined);
    });
    test('findNodes populates nodes list', () => {
        nodeList = new ElementList();
        var nodes = nodeList.findNodes(selector, document.body);
        expect(nodes.length).toBeGreaterThan(0);
        nodes.forEach(node => {
            expect(node.nodeName).toBe(selector.toUpperCase());
        });
    });
    test('constructor with finder loads node list', () => {
        expect(nodeList instanceof ElementList).toBe(true);
        expect(nodeList.nodes.length).toBeGreaterThan(0);
        nodeList.nodes.forEach(node => {
            expect(node.nodeName).toBe(selector.toUpperCase());
        });
    });

    test('currentNode returns undefined in current node index < 0', () => {
        nodeList = new ElementList();
        expect(nodeList.currentNode()).toBe(undefined);
    });
    test('currentNode returns current match for each node in the list', () => {
        for (let index = 0; index < nodeList.nodes.length - 1; index++) {
            nodeList.currentNodeIndex = index;
            expect(nodeList.currentNode()).toBe(nodeList.nodes[index]);
        }
    });
    test('currentNode returns undefined for empty node list', () => {
        nodeList = new ElementList('test', document.body);
        expect(nodeList.nodes.length).toEqual(0);
        expect(nodeList.currentNode()).toBe(undefined);
    });
    test('currentNode returns newly assigned current node', () => {
        for (let index = 0; index < nodeList.nodes.length - 1; index++) {
            const node = nodeList.nodes[index];
            expect(nodeList.currentNode(node)).toBe(nodeList.nodes[index]);
            expect(nodeList.currentNode(node)).toBe(node);
            expect(nodeList.currentNodeIndex).toBe(index);
        }
    });

    test('nextNode returns first match if current node index < 0', () => {
        nodeList.currentNodeIndex = -1;
        expect(nodeList.nextNode()).toBe(nodeList.nodes[0]);
        expect(nodeList.wrappedTo).toBe(undefined);
    });
    test('nextNode returns next match for each node in the list before the last one', () => {
        for (let index = 0; index < nodeList.nodes.length - 2; index++) {
            nodeList.currentNodeIndex = index;
            expect(nodeList.nextNode()).toBe(nodeList.nodes[index + 1]);
            expect(nodeList.wrappedTo).toBe(undefined);
        }
    });
    test('nextNode returns first match for last node in list', () => {
        nodeList.currentNodeIndex = nodeList.nodes.length - 1;
        expect(nodeList.nextNode()).toBe(nodeList.nodes[0]);
        expect(nodeList.wrappedTo).toBe("start");
    });
    test('nextNode returns the only match in the list', () => {
        nodeList = new ElementList('div', document.body);
        expect(nodeList.nodes.length).toEqual(1);
        expect(nodeList.nextNode()).toBe(nodeList.nodes[0]);
        expect(nodeList.nextNode()).toBe(nodeList.nodes[0]);
    });
    test('nextNode returns undefined for empty node list', () => {
        nodeList = new ElementList('test', document.body);
        expect(nodeList.nodes.length).toEqual(0);
        expect(nodeList.nextNode()).toBe(undefined);
        expect(nodeList.wrappedTo).toBe(undefined);
    });

    test('previousNode returns last match if current node index < 0', () => {
        nodeList.currentNodeIndex = -1;
        expect(nodeList.previousNode()).toBe(nodeList.nodes[nodeList.nodes.length - 1]);
        expect(nodeList.wrappedTo).toBe("end");
    });
    test('previousNode returns previous match for each node in the list after the first one', () => {
        for (let index = nodeList.nodes.length - 1; index > 0; index--) {
            nodeList.currentNodeIndex = index;
            expect(nodeList.previousNode()).toBe(nodeList.nodes[index - 1]);
            expect(nodeList.wrappedTo).toBe(undefined);
        }
    });
    test('previousNode returns last match for first node in list', () => {
        nodeList.currentNodeIndex = 0;
        expect(nodeList.previousNode()).toBe(nodeList.nodes[nodeList.nodes.length - 1]);
        expect(nodeList.wrappedTo).toBe("end");
    });    
    test('previousNode returns the only match in the list', () => {
        nodeList = new ElementList('div', document.body);
        expect(nodeList.nodes.length).toEqual(1);
        expect(nodeList.previousNode()).toBe(nodeList.nodes[0]);
        expect(nodeList.previousNode()).toBe(nodeList.nodes[0]);
        expect(nodeList.wrappedTo).toBe(undefined);
    });
    test('previousNode returns undefined for empty node list', () => {
        nodeList = new ElementList('test', document.body);
        expect(nodeList.nodes.length).toEqual(0);
        expect(nodeList.previousNode()).toBe(undefined);
        expect(nodeList.wrappedTo).toBe(undefined);
    });
});
