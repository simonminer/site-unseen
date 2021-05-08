const ScreenReader = require("../modules/screen-reader.js").ScreenReader;

describe("ScreenReader class tests", function () {
    test('constructor creates screen reader object', () => {
        var screenReader = new ScreenReader();
        expect(screenReader instanceof ScreenReader).toBe(true);
    });
});
