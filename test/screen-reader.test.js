const ScreenReader = require("../modules/screen-reader.js").ScreenReader;

var screenReader = undefined;
beforeEach(() => {
    screenReader = new ScreenReader(null);
});


describe("ScreenReader class tests", function () {
    test('constructor creates screen reader object', () => {
        expect(screenReader instanceof ScreenReader).toBe(true);
    });

    test('appendOverlay adds overlay and caption elements to DOM', () => {
        screenReader.appendOverlay();
        expect(document.querySelectorAll(`#${screenReader.overlay.id}`).length).toBe(1);
        expect(document.querySelectorAll(`#${screenReader.caption.id}`).length).toBe(1);
    });
});
