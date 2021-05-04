const WayMaker = require("../modules/way-maker.js").WayMaker;

var wayMaker = undefined;
beforeAll(() => {
    wayMaker = new WayMaker();
});

describe("WayMaker class tests", function () {
    test('constructor creates WayMaker object', () => {
        expect(wayMaker instanceof WayMaker).toBe(true);
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
    test('isTabIndexNeeded returns false for <div> and <span> tags containing both text and other tags', () => {
        wayMaker.potentiallyNavigableTags.forEach(tagName => {
            var node = document.createElement(tagName);
            node.appendChild(document.createElement(tagName));
            node.appendChild(document.createTextNode("test"));
            expect(wayMaker.isTabIndexNeeded(node)).toBe(true);
        });
    });
});
