const Overlay = require('../modules/overlay.js').Overlay;
const HelpContent = require('../modules/help-content.js').HelpContent;

const id = 'help';

var help = undefined;
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
        expect(help.closeButton.getAttribute('id')).toBe(HelpContent.closeButtonId);
    });

    test('help can be hidden and shown', () => {
        help.getHTML();

        expect(help.node.classList.contains(Overlay.hiddenClassName)).toBe(
            true
        );
        expect(help.isVisible()).toBe(false);
        help.show();
        expect(help.isVisible()).toBe(true);
        help.hide();
        expect(help.isVisible()).toBe(false);
    });
});
