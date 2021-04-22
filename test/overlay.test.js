const Overlay = require("../modules/overlay.js").Overlay;

const id = "overlay";
const color = '#010101';
const opacity = 0.9;
const zIndex = 2;

var caption = undefined;
var overlay = undefined;
beforeAll(() => {
    overlay = new Overlay({
        color: color,
        opacity: opacity,
        zIndex: zIndex
    });
});


describe("Overlay class tests", function () {
    test('constructor creates overlay', () => {
        expect(overlay instanceof Overlay).toBe(true);
        expect(overlay.id).toBe(id);
        expect(overlay.color).toBe(color);
        expect(overlay.opacity).toBe(opacity);
        expect(overlay.zIndex).toBe(zIndex);    
    });
});