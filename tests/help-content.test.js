const HelpContent = require('../src/modules/help-content.js').HelpContent;
const Overlay = require('../src/modules/overlay.js').Overlay;
const Config = require('../src/modules/config.js').Config;
const ScreenReader = require('../src/modules/screen-reader.js').ScreenReader;

const id = `${Config.cssPrefix}help`;

var help = undefined;
var screenReader = undefined;
beforeEach(() => {
    help = new HelpContent();
    screenReader = new ScreenReader();
    screenReader.setup();
});

describe('HelpContent class tests', function () {
    test('constructor creates help content', () => {
        expect(help instanceof HelpContent).toBe(true);
        expect(HelpContent.id).toBe(id);
        expect(help.node).toBe(undefined);
    });

    test('getCSS() creates <style> element', () => {
        const style = help.getCSS();
        expect(style instanceof Element).toBe(true);
        expect(style.tagName.toLowerCase()).toBe('style');
    });

    test('getHTML() creates <div> element', () => {
        const div = help.getHTML();
        expect(div instanceof Element).toBe(true);
        expect(help.node).toBe(div);
        expect(div.tagName.toLowerCase()).toBe('div');
        expect(div.getAttribute('id')).toBe(HelpContent.id);
        expect(help.node.classList.contains(Overlay.hiddenClassName)).toBe(
            true
        );

        expect(help.closeButtons.length).toBeGreaterThan(1);
        help.closeButtons.forEach((button) => {
            expect(button instanceof HTMLButtonElement).toBe(true);
            expect(button.getAttribute('class')).toBe(
                HelpContent.closeButtonClassName
            );
        });
    });

    test('help can be hidden and shown', () => {
        const overlayButtons = screenReader.overlay.buttons;
        help.getHTML();

        expect(help.node.classList.contains(Overlay.hiddenClassName)).toBe(
            true
        );
        expect(help.isVisible()).toBe(false);
        help.show(screenReader);
        expect(help.isVisible()).toBe(true);
        expect(
            overlayButtons['Peek'].classList.contains(Overlay.hiddenClassName)
        ).toBe(true);
        expect(
            overlayButtons['Help'].classList.contains(Overlay.hiddenClassName)
        ).toBe(true);
        expect(screenReader.caption.isVisible()).toBe(false);

        help.hide(screenReader);
        expect(help.isVisible()).toBe(false);
        expect(
            overlayButtons['Peek'].classList.contains(Overlay.hiddenClassName)
        ).toBe(false);
        expect(
            overlayButtons['Help'].classList.contains(Overlay.hiddenClassName)
        ).toBe(false);
        expect(screenReader.caption.isVisible()).toBe(true);
    });
});
