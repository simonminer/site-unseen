const Overlay = require("../modules/overlay.js").Overlay;

const color = '#010101';
const opacity = 0.9;
const zIndex = 2;

describe("Overlay class tests", function () {
    test('constructor creates overlay', () => {
        var overlay = new Overlay(color, opacity, zIndex);
        expect(overlay instanceof Overlay).toBe(true);
        expect(overlay.color).toBe(color);
        expect(overlay.opacity).toBe(opacity);
        expect(overlay.zIndex).toBe(zIndex);    
    });
});