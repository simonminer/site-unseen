const ScreenReader = require("../modules/screen-reader.js").ScreenReader;

var screenReader = undefined;
beforeEach(() => {
    document.body.innerHTML = `
    <div id="content">
        <h1>This is a heading</h1>
        <p>This is a paragraph.</p>
        <div><div>This is a nested div.</div></div>
        <input type="text" />
    </div>
    `;
    screenReader = new ScreenReader();
});

describe("ScreenReader class tests", function () {
    test('constructor creates screen reader object', () => {
        expect(screenReader instanceof ScreenReader).toBe(true);
    });

    test('setApplicationRoleOnChildren adds role="application" attribute to children', () => {
        screenReader.setApplicationRoleOnChildren();
        var children = document.body.children;
        for (var i = 0, l = children.length; i < l; i++) {
            expect(children[i].getAttribute('role')).toBe('application');
        }
    });

});
