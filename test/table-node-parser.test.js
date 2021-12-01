const TableNodeParser = require("../modules/table-node-parser.js").TableNodeParser;
const NodeParser = require("../modules/node-parser.js").NodeParser;
const { htmlToElement } = require('./test-utils.js');

describe("TableNodeParser class tests", function () {
    test('constructor creates TableNodeParser node', () => {
        const node = htmlToElement('<table><tr><td>Test</td></tr></table>', 'table');
        var nodeParser = new TableNodeParser({
            rootNode: node
        });
        expect(nodeParser instanceof TableNodeParser).toBe(true);
        expect(nodeParser instanceof NodeParser).toBe(true);
        expect(nodeParser.rootNode).toBe(node);
        expect(nodeParser.virtualTree[0].actualNode.tagName).toBe(node.tagName);
        expect(Object.keys(TableNodeParser.tables).length).toBe(0);
    });
});
