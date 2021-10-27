const Navigator = require("../modules/navigator.js").Navigator;

beforeAll(() => {
    document.body.innerHTML = `
    <div id="content">
        <h1>This is a heading</h1>
        <p>This is a paragraph.</p>
        <div><div>This is a nested div.</div></div>
        <input type="text" />
    </div>
    `;
});
var navigator = undefined;
beforeEach(() => {
    navigator = new Navigator();
});

describe("Navigator class tests", function () {
    test('constructor creates Navigator object', () => {
        expect(navigator instanceof Navigator).toBe(true);
        expect(navigator.className).toBe("srn");
        expect(navigator.nonInteractiveTags.length).toBeGreaterThan(0);
        expect(navigator.interactiveTags.length).toBeGreaterThan(0);
        expect(navigator.potentiallyNavigableTags.length).toBeGreaterThan(0);
        expect(navigator.tabIndexNodeCount).toBe(0);
        expect(navigator.nodes.length).toBe(0);
    });

    test('isTabIndexNeeded returns true for non-interactive tags', () => {
        navigator.nonInteractiveTags.forEach(tagName => {
            var node = document.createElement(tagName);
            expect(navigator.isTabIndexNeeded(node)).toBe(true);
        });
    });
    test('isTabIndexNeeded returns false for interactive tags', () => {
        navigator.interactiveTags.forEach(tagName => {
            var node = document.createElement(tagName);
            expect(navigator.isTabIndexNeeded(node)).toBe(false);
        });
    });
    test('isTabIndexNeeded returns false for empty <div> and <span> tags', () => {
        navigator.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            expect(navigator.isTabIndexNeeded(node)).toBe(false);
        });
    });
    test('isTabIndexNeeded returns true for <div> and <span> tags containing only text', () => {
        navigator.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createTextNode("test"));
            expect(navigator.isTabIndexNeeded(node)).toBe(true);
        });
    });
    test('isTabIndexNeeded returns false for <div> and <span> tags containing only other tags', () => {
        navigator.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createElement(tagName));
            expect(navigator.isTabIndexNeeded(node)).toBe(false);
        });
    });
    test('isTabIndexNeeded returns true for <div> and <span> tags containing both text and other tags', () => {
        navigator.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createElement(tagName));
            node.appendChild(document.createTextNode("test"));
            expect(navigator.isTabIndexNeeded(node)).toBe(true);
        });
    });
    
    test('processNode assigns tabindex and class to non-interactive tags', () => {
        navigator.nonInteractiveTags.forEach(tagName => {
            var node = document.createElement(tagName);
            navigator.processNode(node);
            expect(node.getAttribute("tabindex")).toBe("-1");
            expect(node.classList.contains(navigator.className)).toBe(true);
        });
        expect(navigator.tabIndexNodeCount).toBe(navigator.nonInteractiveTags.length);
        expect(navigator.nodes.length).toBe(navigator.nonInteractiveTags.length);
    });
    test('processNode assigns class to interactive tags', () => {
        navigator.interactiveTags.forEach(tagName => {
            var node = document.createElement(tagName);
            navigator.processNode(node);
            expect(node.getAttribute("tabindex")).toBe(null);
            expect(node.classList.contains(navigator.className)).toBe(true);
        });
        expect(navigator.tabIndexNodeCount).toBe(0);
        expect(navigator.nodes.length).toBe(navigator.interactiveTags.length);
    });
    test('processNode does nothing to empty <div> and <span> tags', () => {
        navigator.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            navigator.processNode(node);
            expect(node.getAttribute("tabindex")).toBe(null);
            expect(node.classList.contains(navigator.className)).toBe(false);
        });
        expect(navigator.tabIndexNodeCount).toBe(0);
        expect(navigator.nodes.length).toBe(0);
    });
    test('processNode assigns tabindex and class to <div> and <span> tags containing only text', () => {
        navigator.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createTextNode("test"));
            navigator.processNode(node);
            expect(node.getAttribute("tabindex")).toBe("-1");
            expect(node.classList.contains(navigator.className)).toBe(true);
        });
        expect(navigator.tabIndexNodeCount).toBe(navigator.potentiallyNavigableTags.length);
        expect(navigator.nodes.length).toBe(navigator.potentiallyNavigableTags.length);
    });
    test('processNode does nothing to <div> and <span> tags containing only other tags', () => {
        navigator.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createElement(tagName));
            navigator.processNode(node);
            expect(node.getAttribute("tabindex")).toBe(null);
            expect(node.classList.contains(navigator.className)).toBe(false);
        });
        expect(navigator.tabIndexNodeCount).toBe(0);
        expect(navigator.nodes.length).toBe(0);
    });
    test('processNode assigns tabindex and class to <div> and <span> tags containing both text and other tags', () => {
        navigator.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createTextNode("test"));
            node.appendChild(document.createElement(tagName));
            navigator.processNode(node);
            expect(node.getAttribute("tabindex")).toBe("-1");
            expect(node.classList.contains(navigator.className)).toBe(true);
        });
        expect(navigator.tabIndexNodeCount).toBe(navigator.potentiallyNavigableTags.length);
        expect(navigator.nodes.length).toBe(navigator.potentiallyNavigableTags.length);
    });

    test('markNavigableNodes flags appropriate nodes', () => {
        navigator.markNavigableNodes(document.body);
        expect(document.querySelectorAll('[tabindex="-1"]').length).toBe(3);
        expect(document.querySelectorAll(`[class="${navigator.className}"]`).length).toBe(4);
        expect(navigator.nodes.length).toBe(4);
    });

    test('currentNode returns undefined in current node index < 0', () => {
        navigator.currentNodeIndex = -1;
        expect(navigator.currentNode()).toBe(undefined);
    });
    test('currentNode returns current match for each node in the list', () => {
        for (let index = 0; index < navigator.nodes.length - 1; index++) {
            navigator.nextNode();
            expect(navigator.currentNode()).toBe(navigator.nodes[index]);
        }
    });
    test('currentNode returns undefined for empty node list', () => {
        navigator = new Navigator( 'test', 'test', document.body);
        expect(navigator.nodes.length).toEqual(0);
        expect(navigator.currentNode()).toBe(undefined);
    });

    test('nextNode returns first match if current node index < 0', () => {
        navigator.markNavigableNodes(document.body);
        navigator.currentNodeIndex = -1;
        expect(navigator.nextNode()).toBe(navigator.nodes[0]);
        expect(navigator.wrappedTo).toBe(undefined);
    });
    test('nextNode returns next match for each node in the list before the last one', () => {
        navigator.markNavigableNodes(document.body);
        for (let index = 0; index < navigator.nodes.length - 2; index++) {
            navigator.currentNodeIndex = index;
            expect(navigator.nextNode()).toBe(navigator.nodes[index + 1]);
            expect(navigator.wrappedTo).toBe(undefined);
        }
    });
    test('nextNode returns first match for last node in list', () => {
        navigator.markNavigableNodes(document.body);
        navigator.currentNodeIndex = navigator.nodes.length - 1;
        expect(navigator.nextNode()).toBe(navigator.nodes[0]);
        expect(navigator.wrappedTo).toBe("start");
    });

    test('previousNode returns last match if current node index < 0', () => {
        navigator.markNavigableNodes(document.body);
        navigator.currentNodeIndex = -1;
        expect(navigator.previousNode()).toBe(navigator.nodes[navigator.nodes.length - 1]);
        expect(navigator.wrappedTo).toBe("end");
    });
    test('previousNode returns previous match for each node in the list after the first one', () => {
        navigator.markNavigableNodes(document.body);
        for (let index = navigator.nodes.length - 1; index > 0; index--) {
            navigator.currentNodeIndex = index;
            expect(navigator.previousNode()).toBe(navigator.nodes[index - 1]);
            expect(navigator.wrappedTo).toBe(undefined);
        }
    });
    test('previousNode returns last match for first node in list', () => {
        navigator.markNavigableNodes(document.body);
        navigator.currentNodeIndex = 0
        expect(navigator.previousNode()).toBe(navigator.nodes[navigator.nodes.length - 1]);
        expect(navigator.wrappedTo).toBe("end");
    });
});
