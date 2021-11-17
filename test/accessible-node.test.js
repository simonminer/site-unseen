const AccessibleNode = require("../modules/accessible-node.js").AccessibleNode;

describe("AccessibleNode class tests", function () {
    test('constructor creates accessible node', () => {
        var aNode = new AccessibleNode();
        expect(aNode instanceof AccessibleNode).toBe(true);
    });

});
