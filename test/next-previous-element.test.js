const np = require("../lib/next-previous-element");

describe("getPreviousElement tests", function () {
    test('getPreviousElement is null without node', () => {
        expect(np.getPreviousElement()).toBe(null);
    });
    test('getPreviousElement is null for single node', () => {
        const textNode = document.createTextNode("This is a test");
        expect(np.getPreviousElement(textNode)).toBe(null);
    });
});

describe("getNextElement tests", function () {
    test('getNextElement is null without node', () => {
        expect(np.getNextElement()).toBe(null);
    });
    test('getNextElement is null for single node', () => {
        const textNode = document.createTextNode("This is a test");
        expect(np.getNextElement(textNode)).toBe(null);
    });
});