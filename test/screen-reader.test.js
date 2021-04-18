const ScreenReader = require("../modules/screen-reader.js").ScreenReader;

describe("ScreenReader class tests", function () {
    test('constructor creates screen reader object', () => {
        var sr = new ScreenReader(null, null);
        expect(sr instanceof ScreenReader).toBe(true);
    });
});
