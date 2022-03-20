const Overlay = require('../src/modules/overlay.js').Overlay;
const { sleep } = require('./test-utils.js');

const id = `${Overlay.cssPrefix}overlay`;

var caption = undefined;
var overlay = undefined;
beforeEach(() => {
    overlay = new Overlay();
});

describe('Overlay class tests', function () {
    test('constructor creates overlay', () => {
        expect(overlay instanceof Overlay).toBe(true);
        expect(Overlay.cssPrefix).not.toBe(undefined);
        expect(Overlay.id).toBe(id);
        expect(overlay.node).toBe(undefined);
        expect(overlay.buttonClassName).toBe(`${Overlay.cssPrefix}overlay-button`);
        expect(overlay.startX).toBe(0);
        expect(overlay.endX).toBe(0);
        expect(overlay.previousTapTime).toBe(0);
        expect(overlay.maxDoubleTapDelay).toBeGreaterThan(0);

        expect(Overlay.peekTimeout).toBeGreaterThan(0);
        expect(Overlay.opacity).toBeGreaterThan(0);
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
        expect(div.getAttribute('id')).toBe(Overlay.id);
        expect(Object.keys(overlay.buttons).length).toBeGreaterThan(0);
    });

    test('generateButton() creates <button> element', () => {
        ['Peek', 'Settings', 'Help'].forEach((name) => {
            const button = overlay.generateButton(name);
            expect(button instanceof Element).toBe(true);
            expect(button.tagName.toLowerCase()).toBe('button');
            const id = `${Overlay.cssPrefix}${name.toLowerCase()}-button`;
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

        expect(overlay.isVisible()).toBe(true);
        overlay.hide();
        expect(overlay.isVisible()).toBe(false);
        overlay.show();
        expect(overlay.isVisible()).toBe(true);
    });

    test('overlay can register double tap', async () => {
        expect(overlay.previousTapTime).toBe(0);
        expect(overlay.isDoubleTap()).toBe(false);
        await sleep(parseInt(overlay.maxDoubleTapDelay / 2));
        expect(overlay.isDoubleTap()).toBe(true);
        expect(overlay.previousTapTime).toBe(0);
        await sleep(parseInt(overlay.maxDoubleTapDelay * 2));
        expect(overlay.isDoubleTap()).toBe(false);
    });
});
