const TableNode = require("../../modules/accessible-node/table-node.js").TableNode;
const AccessibleNode = require("../../modules/accessible-node.js").AccessibleNode;
const { htmlToElement } = require('../test-utils.js');

describe("TableNode class tests", function () {
    test('constructor creates accessible table node', () => {
        var linkName = 'test-link';
        var node = htmlToElement('<table><tr><td>Test</td></tr></table>', 'table');
        var aNode = new TableNode(node);
        expect(aNode instanceof TableNode).toBe(true);
        expect(aNode instanceof AccessibleNode).toBe(true);
        expect(aNode.actualNode).toBe(node);
        expect(aNode.tagName).toBe(node.tagName.toLowerCase());
        expect(aNode.name).toBe(undefined);
        expect(aNode.rowCount).toBe(0);
        expect(aNode.columnCount).toBe(0);
        expect(aNode.cells.length).toBe(0);
        expect(Object.keys(aNode.nodes).length).toBe(0);
    });
});
