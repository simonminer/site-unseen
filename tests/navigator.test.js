const Navigator = require('../src/modules/navigator.js').Navigator;

var navigator = undefined;
beforeEach(() => {
    navigator = new Navigator();
    document.body.innerHTML = `
    <div id="content">
        <input type="text" />
        <h1>This is a heading</h1>
        <p>This is a paragraph.</p>
        <div><div>This is a nested div.</div></div>
        <h1 style="display: none">display: none</h1>
        <h1 style="visibility: hidden">visibility: hidden</h1>
        <a href="#top">Link</a>
        <h1 aria-hidden="true">Hidden from assitive technologies</h1>
    </div>
    `;
});

describe('Navigator class tests', function () {
    test('constructor creates Navigator object', () => {
        expect(navigator instanceof Navigator).toBe(true);
        expect(navigator.className).toBe('srn');
        expect(navigator.nonInteractiveTags.length).toBeGreaterThan(0);
        expect(navigator.interactiveTags.length).toBeGreaterThan(0);
        expect(navigator.potentiallyNavigableTags.length).toBeGreaterThan(0);
        expect(navigator.tabIndexNodeCount).toBe(0);
        expect(navigator.nodes.length).toBe(0);
    });

    test('isTabIndexNeeded returns true for non-interactive tags', () => {
        navigator.nonInteractiveTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            expect(navigator.isTabIndexNeeded(node)).toBe(true);
        });
    });
    test('isTabIndexNeeded returns false for interactive tags', () => {
        navigator.interactiveTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            expect(navigator.isTabIndexNeeded(node)).toBe(false);
        });
    });
    test('isTabIndexNeeded returns false for empty <div> and <span> tags', () => {
        navigator.potentiallyNavigableTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            expect(navigator.isTabIndexNeeded(node)).toBe(false);
        });
    });
    test('isTabIndexNeeded returns true for <div> and <span> tags with roles', () => {
        navigator.potentiallyNavigableTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            node.setAttribute('role', 'test');
            expect(navigator.isTabIndexNeeded(node)).toBe(true);
        });
    });
    test('isTabIndexNeeded returns true for <div> and <span> tags containing only text', () => {
        navigator.potentiallyNavigableTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            node.appendChild(document.createTextNode('test'));
            expect(navigator.isTabIndexNeeded(node)).toBe(true);
        });
    });
    test('isTabIndexNeeded returns false for <div> and <span> tags containing only other tags', () => {
        navigator.potentiallyNavigableTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            node.appendChild(document.createElement(tagName));
            expect(navigator.isTabIndexNeeded(node)).toBe(false);
        });
    });
    test('isTabIndexNeeded returns true for <div> and <span> tags containing both text and other tags', () => {
        navigator.potentiallyNavigableTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            node.appendChild(document.createElement(tagName));
            node.appendChild(document.createTextNode('test'));
            expect(navigator.isTabIndexNeeded(node)).toBe(true);
        });
    });

    test('isNavigable returns whether or not the screen reader can navigate a tag', () => {
        document.querySelectorAll('h1').forEach((node) => {
            const style = window.getComputedStyle(node);
            const isNavigable =
                style.display === 'none' ||
                style.visibility === 'hidden' ||
                node.hasAttribute('aria-hidden')
                    ? false
                    : true;
            expect(navigator.isNavigable(node)).toBe(isNavigable);
        });
    });
    test('isNavigable returns true for visible tags', () => {
        var node = document.createElement('h1');
        node.setAttribute('aria-hidden', 'true');
        expect(navigator.isNavigable(node)).toBe(false);
    });
    test('isNavigable returns false for tags with aria-hidden attribute', () => {
        var node = document.createElement('h1');
        node.setAttribute('aria-hidden', 'true');
        expect(navigator.isNavigable(node)).toBe(false);
    });
    test('isNavigable returns false for tag with display: none CSS rule', () => {
        var node = document.createElement('h1');
        node.setAttribute('style', 'display: none');
        expect(navigator.isNavigable(node)).toBe(false);
    });
    test('isNavigable returns false for tag with visibility: hidden CSS rule', () => {
        var node = document.createElement('h1');
        node.setAttribute('style', 'visibility: hidden');
        expect(navigator.isNavigable(node)).toBe(false);
    });

    test('processNode assigns tabindex and class to non-interactive tags', () => {
        navigator.nonInteractiveTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            navigator.processNode(node);
            expect(node.getAttribute('tabindex')).toBe('-1');
            expect(node.classList.contains(navigator.className)).toBe(true);
        });
        expect(navigator.tabIndexNodeCount).toBe(
            navigator.nonInteractiveTags.length
        );
        expect(navigator.nodes.length).toBe(
            navigator.nonInteractiveTags.length
        );
    });
    test('processNode assigns class to interactive tags', () => {
        navigator.interactiveTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            navigator.processNode(node);
            expect(node.getAttribute('tabindex')).toBe(null);
            expect(node.classList.contains(navigator.className)).toBe(true);
        });
        expect(navigator.tabIndexNodeCount).toBe(0);
        expect(navigator.nodes.length).toBe(navigator.interactiveTags.length);
    });
    test('processNode does nothing to empty <div> and <span> tags', () => {
        navigator.potentiallyNavigableTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            navigator.processNode(node);
            expect(node.getAttribute('tabindex')).toBe(null);
            expect(node.classList.contains(navigator.className)).toBe(false);
        });
        expect(navigator.tabIndexNodeCount).toBe(0);
        expect(navigator.nodes.length).toBe(0);
    });
    test('processNode assigns tabindex and class to <div> and <span> tags containing only text', () => {
        navigator.potentiallyNavigableTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            node.appendChild(document.createTextNode('test'));
            navigator.processNode(node);
            expect(node.getAttribute('tabindex')).toBe('-1');
            expect(node.classList.contains(navigator.className)).toBe(true);
        });
        expect(navigator.tabIndexNodeCount).toBe(
            navigator.potentiallyNavigableTags.length
        );
        expect(navigator.nodes.length).toBe(
            navigator.potentiallyNavigableTags.length
        );
    });
    test('processNode does nothing to <div> and <span> tags containing only other tags', () => {
        navigator.potentiallyNavigableTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            node.appendChild(document.createElement(tagName));
            navigator.processNode(node);
            expect(node.getAttribute('tabindex')).toBe(null);
            expect(node.classList.contains(navigator.className)).toBe(false);
        });
        expect(navigator.tabIndexNodeCount).toBe(0);
        expect(navigator.nodes.length).toBe(0);
    });
    test('processNode assigns tabindex and class to <div> and <span> tags containing both text and other tags', () => {
        navigator.potentiallyNavigableTags.forEach((tagName) => {
            var node = document.createElement(tagName);
            node.appendChild(document.createTextNode('test'));
            node.appendChild(document.createElement(tagName));
            navigator.processNode(node);
            expect(node.getAttribute('tabindex')).toBe('-1');
            expect(node.classList.contains(navigator.className)).toBe(true);
        });
        expect(navigator.tabIndexNodeCount).toBe(
            navigator.potentiallyNavigableTags.length
        );
        expect(navigator.nodes.length).toBe(
            navigator.potentiallyNavigableTags.length
        );
    });

    test('markNavigableNodes flags appropriate nodes', () => {
        navigator.markNavigableNodes(document.body);
        expect(document.querySelectorAll('[tabindex="-1"]').length).toBe(3);
        expect(
            document.querySelectorAll(`[class="${navigator.className}"]`).length
        ).toBe(5);
        expect(navigator.nodes.length).toBe(5);
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
        navigator = new Navigator('test', 'test', document.body);
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
        expect(navigator.wrappedTo).toBe('start');
    });

    test('previousNode returns last match if current node index < 0', () => {
        navigator.markNavigableNodes(document.body);
        navigator.currentNodeIndex = -1;
        expect(navigator.previousNode()).toBe(
            navigator.nodes[navigator.nodes.length - 1]
        );
        expect(navigator.wrappedTo).toBe('end');
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
        navigator.currentNodeIndex = 0;
        expect(navigator.previousNode()).toBe(
            navigator.nodes[navigator.nodes.length - 1]
        );
        expect(navigator.wrappedTo).toBe('end');
    });

    test('previousInteractiveNode returns the previous interactive tag', () => {
        navigator.markNavigableNodes(document.body);
        navigator.currentNode(document.querySelector('a'));
        var previousInteractiveNode = navigator.previousInteractiveNode();
        var tagName = previousInteractiveNode.tagName.toLowerCase();
        expect(navigator.interactiveTags.includes(tagName)).toBe(true);
        expect(tagName).toBe('input');
        expect(navigator.wrappedTo).toBe(undefined);

        previousInteractiveNode = navigator.previousInteractiveNode();
        tagName = previousInteractiveNode.tagName.toLowerCase();
        expect(navigator.interactiveTags.includes(tagName)).toBe(true);
        expect(tagName).toBe('a');
        expect(navigator.wrappedTo).toBe('end');
    });
    test('previousInteractiveNode returns the current node if there are no other interactive ones', () => {
        document.body.querySelector('input').remove();
        document.body.querySelector('a').remove();
        const tagName = 'p';
        navigator.markNavigableNodes(document.body);
        const node = navigator.currentNode(document.querySelector(tagName));
        const index = navigator.currentNodeIndex;
        var previousInteractiveNode = navigator.previousInteractiveNode();
        expect(previousInteractiveNode).toBe(node);
        expect(previousInteractiveNode.tagName.toLowerCase()).toBe(tagName);
        expect(navigator.currentNodeIndex).toBe(index);
    });
    test('nextInteractiveNode returns the next interactive tag', () => {
        navigator.markNavigableNodes(document.body);
        navigator.currentNode(document.querySelector('input'));
        var nextInteractiveNode = navigator.nextInteractiveNode();
        var tagName = nextInteractiveNode.tagName.toLowerCase();
        expect(navigator.interactiveTags.includes(tagName)).toBe(true);
        expect(tagName).toBe('a');
        expect(navigator.wrappedTo).toBe(undefined);

        nextInteractiveNode = navigator.nextInteractiveNode();
        tagName = nextInteractiveNode.tagName.toLowerCase();
        expect(navigator.interactiveTags.includes(tagName)).toBe(true);
        expect(tagName).toBe('input');
        expect(navigator.wrappedTo).toBe('start');
    });
    test('nextInteractiveNode returns the current node if there are no other interactive ones', () => {
        document.body.querySelector('input').remove();
        document.body.querySelector('a').remove();
        const tagName = 'p';
        navigator.markNavigableNodes(document.body);
        const node = navigator.currentNode(document.querySelector(tagName));
        const index = navigator.currentNodeIndex;
        var nextInteractiveNode = navigator.nextInteractiveNode();
        expect(nextInteractiveNode).toBe(node);
        expect(nextInteractiveNode.tagName.toLowerCase()).toBe(tagName);
        expect(navigator.currentNodeIndex).toBe(index);
    });
});
