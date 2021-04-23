const Overlay = require("../modules/overlay.js").Overlay;

const id = "overlay";

var caption = undefined;
var overlay = undefined;
beforeAll(() => {
    overlay = new Overlay();
});


describe("Overlay class tests", function () {
    test('constructor creates overlay', () => {
        expect(overlay instanceof Overlay).toBe(true);
        expect(overlay.id).toBe(id);
    });
});