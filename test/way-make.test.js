const WayMaker = require("../modules/way-maker.js").WayMaker;

var wayMaker = undefined;
beforeEach(() => {
    wayMaker = new WayMaker();
});

describe("WayMaker class tests", function () {
    test('constructor creates WayMaker object', () => {
        expect(wayMaker instanceof WayMaker).toBe(true);
        expect(wayMaker.className).toBe("srn");
        expect(wayMaker.nonInteractiveTags.length).toBeGreaterThan(0);
        expect(wayMaker.interactiveTags.length).toBeGreaterThan(0);
        expect(wayMaker.potentiallyNavigableTags.length).toBeGreaterThan(0);
        expect(wayMaker.tabIndexNodeCount).toBe(0);
        expect(wayMaker.navigableNodeCount).toBe(0);
    });

    test('isTabIndexNeeded returns true for non-interactive tags', () => {
        wayMaker.nonInteractiveTags.forEach(tagName => {
            var node = document.createElement(tagName);
            expect(wayMaker.isTabIndexNeeded(node)).toBe(true);
        });
    });
    test('isTabIndexNeeded returns false for interactive tags', () => {
        wayMaker.interactiveTags.forEach(tagName => {
            var node = document.createElement(tagName);
            expect(wayMaker.isTabIndexNeeded(node)).toBe(false);
        });
    });
    test('isTabIndexNeeded returns false for empty <div> and <span> tags', () => {
        wayMaker.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            expect(wayMaker.isTabIndexNeeded(node)).toBe(false);
        });
    });
    test('isTabIndexNeeded returns true for <div> and <span> tags containing only text', () => {
        wayMaker.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createTextNode("test"));
            expect(wayMaker.isTabIndexNeeded(node)).toBe(true);
        });
    });
    test('isTabIndexNeeded returns false for <div> and <span> tags containing only other tags', () => {
        wayMaker.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createElement(tagName));
            expect(wayMaker.isTabIndexNeeded(node)).toBe(false);
        });
    });
    test('isTabIndexNeeded returns true for <div> and <span> tags containing both text and other tags', () => {
        wayMaker.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createElement(tagName));
            node.appendChild(document.createTextNode("test"));
            expect(wayMaker.isTabIndexNeeded(node)).toBe(true);
        });
    });
    
    test('processNode assigns tabindex and class to non-interactive tags', () => {
        wayMaker.nonInteractiveTags.forEach(tagName => {
            var node = document.createElement(tagName);
            wayMaker.processNode(node);
            expect(node.getAttribute("tabindex")).toBe("-1");
            expect(node.classList.contains(wayMaker.className)).toBe(true);
        });
        expect(wayMaker.tabIndexNodeCount).toBe(wayMaker.nonInteractiveTags.length);
        expect(wayMaker.navigableNodeCount).toBe(wayMaker.nonInteractiveTags.length);
    });
    test('processNode assigns class to interactive tags', () => {
        wayMaker.interactiveTags.forEach(tagName => {
            var node = document.createElement(tagName);
            wayMaker.processNode(node);
            expect(node.getAttribute("tabindex")).toBe(null);
            expect(node.classList.contains(wayMaker.className)).toBe(true);
        });
        expect(wayMaker.tabIndexNodeCount).toBe(0);
        expect(wayMaker.navigableNodeCount).toBe(wayMaker.interactiveTags.length);
    });
    test('processNode does nothing to empty <div> and <span> tags', () => {
        wayMaker.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            wayMaker.processNode(node);
            expect(node.getAttribute("tabindex")).toBe(null);
            expect(node.classList.contains(wayMaker.className)).toBe(false);
        });
        expect(wayMaker.tabIndexNodeCount).toBe(0);
        expect(wayMaker.navigableNodeCount).toBe(0);
    });
    test('processNode assigns tabindex and class to <div> and <span> tags containing only text', () => {
        wayMaker.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createTextNode("test"));
            wayMaker.processNode(node);
            expect(node.getAttribute("tabindex")).toBe("-1");
            expect(node.classList.contains(wayMaker.className)).toBe(true);
        });
        expect(wayMaker.tabIndexNodeCount).toBe(wayMaker.potentiallyNavigableTags.length);
        expect(wayMaker.navigableNodeCount).toBe(wayMaker.potentiallyNavigableTags.length);
    });
    test('processNode does nothing to <div> and <span> tags containing only other tags', () => {
        wayMaker.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createElement(tagName));
            wayMaker.processNode(node);
            expect(node.getAttribute("tabindex")).toBe(null);
            expect(node.classList.contains(wayMaker.className)).toBe(false);
        });
        expect(wayMaker.tabIndexNodeCount).toBe(0);
        expect(wayMaker.navigableNodeCount).toBe(0);
    });
    test('processNode assigns tabindex and class to <div> and <span> tags containing both text and other tags', () => {
        wayMaker.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createTextNode("test"));
            node.appendChild(document.createElement(tagName));
            wayMaker.processNode(node);
            expect(node.getAttribute("tabindex")).toBe("-1");
            expect(node.classList.contains(wayMaker.className)).toBe(true);
        });
        expect(wayMaker.tabIndexNodeCount).toBe(wayMaker.potentiallyNavigableTags.length);
        expect(wayMaker.navigableNodeCount).toBe(wayMaker.potentiallyNavigableTags.length);
    });
});