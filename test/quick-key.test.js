const { TestScheduler } = require("jest");
const QuickKey = require("../lib/quick-key.js").QuickKey;

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