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

    test('getCSS() creates <style> element', () => {
        var style = overlay.getCSS();
        expect(style instanceof Element).toBe(true);
        expect(style.tagName.toLowerCase()).toBe("style");
    });

    test('getHTML() creates <div> element', () => {
        var div = overlay.getHTML();
        expect(div instanceof Element).toBe(true);
        expect(div.tagName.toLowerCase()).toBe("div");
        expect(div.getAttribute("id")).toBe(overlay.id);
    });
});