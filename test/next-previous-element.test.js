const np = require("../lib/next-previous-element");

// One-time setup.
var paragraphNodes = [];
beforeAll(() => {
    document.body.innerHTML = `
<div id="content">
    <h1>Inclusiville Screen Shade and Screen Reader Description Proof-of-Concept</h1>
    <p> This page is overlaid with a dark grey layer that prevents mouse interaction with its content.  However, interactive elements can still be accessed with the keyboard (via the Tab and Shift+Tab keys). When an element comes into focus, its ARIA role and text should appear in the description box at the bottom right of the page, much like what happens with the VoiceOver screen reader on Mac OS X.</p>
    <p>The Inclusiville project was started at the <a href="https://www.deque.com/axe-con/axe-hackathon/" target="new">2021 axe-hackathon (opens in new window)</a>. Tab to this link and press space or Enter to learn about this event.</p>
    <p>
        When it's in focus, this button displays an alert message when you press space or Enter.
        <button onclick="alert( 'You pressed me with the keyboard');">Press me</button>
    </p>
    <p>
        This button doesn't do anything, but it can be focused on using the Tab key.
        <button>Another Button</button>
    </p>
    <p>
        A next step is to override the left and right arrow keys so that they can be used to navigate through all page elements, whether or not they are interactive.
    </p>
</div>
 `;
    paragraphNodes = document.querySelectorAll('p');
});

describe("getPreviousElement tests", function () {
    test('getPreviousElement is null without node', () => {
        expect(np.getPreviousElement()).toBe(null);
    });
    test('getPreviousElement is null for single node', () => {
        const textNode = document.createTextNode("This is a test");
        expect(np.getPreviousElement(textNode)).toBe(null);
    });
    test('getPreviousElement returns previous element sibling', () => {
        expect(np.getPreviousElement(paragraphNodes[2])).toBe(paragraphNodes[1]);
    });
    test('getPreviousElement returns parent element', () => {
        const headingNode = document.querySelector('h1');
        expect(np.getPreviousElement(headingNode)).toBe(headingNode.parentElement);
    });
    test('getPreviousElement returns null for first element', () => {
        const firstNode = document.firstElementChild;
        expect(np.getPreviousElement(firstNode)).toBe(null);
    });
});

describe("getNextElement tests", function () {
    test('getNextElement is null without node', () => {
        expect(np.getNextElement()).toBe(null);
    });
    test('getNextElement is null for single node', () => {
        const textNode = document.createTextNode("This is a test");
        expect(np.getNextElement(textNode)).toBe(null);
    });
    test('getNextElement returns next element sibling', () => {
        expect(np.getNextElement(paragraphNodes[0])).toBe(paragraphNodes[1]);
    });
    test('getNextElement returns first child', () => {
        expect(np.getNextElement(paragraphNodes[1])).toBe(paragraphNodes[1].firstElementChild);
    });
     test('getNextElement returns parent\'s next element sibling', () => {
        const anchorNode = document.querySelector('a');
        expect(np.getNextElement(anchorNode)).toBe(anchorNode.parentElement.nextElementSibling);
    });
    test('getNextElement returns null for last element', () => {
        expect(np.getNextElement(paragraphNodes[paragraphNodes.length - 1])).toBe(null);
    });
});
