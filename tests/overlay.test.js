const Overlay = require('../modules/overlay.js').Overlay;

const id = 'overlay';

var caption = undefined;
var overlay = undefined;
beforeEach(() => {
    overlay = new Overlay();
});

describe('Overlay class tests', function () {
    test('constructor creates overlay', () => {
        expect(overlay instanceof Overlay).toBe(true);
        expect(overlay.id).toBe(id);
        expect(overlay.node).toBe(undefined);
        expect(overlay.buttonClassName).toBe('overlay-button');
        expect(Overlay.peekTimeout).toBeGreaterThan(0);
    });

    test('getCSS() creates <style> element', () => {
        var style = overlay.getCSS();
        expect(style instanceof Element).toBe(true);
        expect(style.tagName.toLowerCase()).toBe('style');
    });

    test('getHTML() creates <div> element', () => {
        var div = overlay.getHTML();
        expect(div instanceof Element).toBe(true);
        expect(overlay.node).toBe(div);
        expect(div.tagName.toLowerCase()).toBe('div');
        expect(div.getAttribute('id')).toBe(overlay.id);
        expect(Object.keys(overlay.buttons).length).toBeGreaterThan(0);
    });

    test('generateButton() creates <button> element', () => {
        ['Peek', 'Settings', 'Help'].forEach((name) => {
            const button = overlay.generateButton(name);
            expect(button instanceof Element).toBe(true);
            expect(button.tagName.toLowerCase()).toBe('button');
            const id = `${name.toLowerCase()}-button`;
            expect(button.getAttribute('id')).toBe(id);
            expect(button.getAttribute('class')).toBe(overlay.buttonClassName);
            expect(button.textContent).toBe(name);
        });
    });

    test('overlay can be hidden and shown', () => {
        overlay.getHTML();
        var className = Overlay.hiddenClassName;
        var re = new RegExp(className, 'sm');
        expect(overlay.css.match(re).length).toBe(1);

        expect(overlay.isHidden()).toBe(false);
        overlay.hide();
        expect(overlay.isHidden()).toBe(true);
        overlay.show();
        expect(overlay.isHidden()).toBe(false);
    });
});
