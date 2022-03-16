const HelpContent = require('../src/modules/help-content.js').HelpContent;
const Overlay = require('../src/modules/overlay.js').Overlay;
const ScreenReader = require('../src/modules/screen-reader.js').ScreenReader;

const id = 'help';

var help = undefined;
const screenReader = new ScreenReader();
beforeEach(() => {
    help = new HelpContent();
});

describe('OHelpContent class tests', function () {
    test('constructor creates help content', () => {
        expect(help instanceof HelpContent).toBe(true);
        expect(HelpContent.id).toBe(id);
        expect(help.node).toBe(undefined);
    });

    test('getCSS() creates <style> element', () => {
        var style = help.getCSS();
        expect(style instanceof Element).toBe(true);
        expect(style.tagName.toLowerCase()).toBe('style');
    });

    test('getHTML() creates <div> element', () => {
        var div = help.getHTML();
        expect(div instanceof Element).toBe(true);
        expect(help.node).toBe(div);
        expect(div.tagName.toLowerCase()).toBe('div');
        expect(div.getAttribute('id')).toBe(HelpContent.id);
        expect(help.node.classList.contains(Overlay.hiddenClassName)).toBe(
            true
        );

        expect(help.closeButton instanceof HTMLButtonElement).toBe(true);
        expect(help.closeButton.getAttribute('id')).toBe(
            HelpContent.closeButtonId
        );
    });

    test('help can be hidden and shown', () => {
        const overlayButtons = screenReader.overlay.buttons;
        help.getHTML();

        expect(help.node.classList.contains(Overlay.hiddenClassName)).toBe(
            true
        );
        expect(help.isVisible()).toBe(false);
        help.show(overlayButtons);
        expect(help.isVisible()).toBe(true);
        expect(
            overlayButtons['Peek'].classList.contains(Overlay.hiddenClassName)
        ).toBe(true);
        expect(
            overlayButtons['Help'].classList.contains(Overlay.hiddenClassName)
        ).toBe(true);

        help.hide(overlayButtons);
        expect(help.isVisible()).toBe(false);
        expect(
            overlayButtons['Peek'].classList.contains(Overlay.hiddenClassName)
        ).toBe(false);
        expect(
            overlayButtons['Help'].classList.contains(Overlay.hiddenClassName)
        ).toBe(false);
    });
});
