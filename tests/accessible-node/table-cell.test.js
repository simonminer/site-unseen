const TableCellNode =
    require('../../modules/accessible-node/table-cell-node.js').TableCellNode;
const AccessibleNode =
    require('../../modules/accessible-node.js').AccessibleNode;
const { htmlToElement } = require('../test-utils.js');

describe('TableCellNode class tests', function () {
    test('constructor creates accessible table node', () => {
        var node = htmlToElement('<table><tr><td></td></tr></table>', 'td');
        var aNode = new TableCellNode(node);
        expect(aNode instanceof TableCellNode).toBe(true);
        expect(aNode instanceof AccessibleNode).toBe(true);
        expect(aNode.actualNode).toBe(node);
        expect(aNode.tagName).toBe(node.tagName.toLowerCase());
        expect(aNode.name).toBe(undefined);
        expect(aNode.rowIndex).toBe(-1);
        expect(aNode.columnIndex).toBe(-1);
        expect(aNode.rowSpan).toBe(1);
        expect(aNode.columnSpan).toBe(1);
        expect(aNode.rowHeading).toBe(undefined);
        expect(aNode.columnHeading).toBe(undefined);
        expect(aNode.cellType).toBe('cell');
        expect(aNode.table).toBe(undefined);
    });
});
