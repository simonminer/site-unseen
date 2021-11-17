const AccessibleNode = require("../modules/accessible-node.js").AccessibleNode;
const { htmlToElement } = require('./test-utils.js');

describe("AccessibleNode class tests", function () {
    test('constructor creates accessible node', () => {
        var node = htmlToElement( '<h1>Heading 1</h1>', 'h1' );
        var aNode = new AccessibleNode(node);
        expect(aNode instanceof AccessibleNode).toBe(true);
        expect(aNode.actualNode).toBe(node);
        expect(aNode.tagName).toBe(node.tagName);
    });

});
