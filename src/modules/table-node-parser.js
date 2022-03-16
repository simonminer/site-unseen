/**
 * Class to parse HTML tables into accessible data structures.
 * @extends NodeParser
 */

'use strict';

import { NodeParser } from './node-parser.js';
import { TableNode } from './accessible-node/table-node.js';
import { TableCellNode } from './accessible-node/table-cell-node.js';

export class TableNodeParser extends NodeParser {
    /**
     * Number of rows in this table.
     * @type {number}
     */
    rowCount = 0;

    /**
     * @static
     * Associateive array mapping table nodes (Node objects)
     * to their corresponding TableNode objects.
     * @type {Object}
     */
    static tables = {};

    /**
     * Parse the contents of the specified accessible node
     * (which must be have a role of "table") to set up
     * accessibility and navigational data.
     * @param {AccessibleNode} aNode - The accessible node associated with the table being parsed.
     * @returns {TableNode} - The parsed accessible table node.
     */
    parse(aNode) {
        // Make sure that this is a table node.
        if (aNode.tagName !== 'table' && aNode.role !== 'table') {
            return;
        }

        const tableNode = aNode.actualNode;
        if (TableNodeParser.tables[tableNode] !== undefined) {
            return TableNodeParser.tables[tableNode];
        }

        var aTableNode = new TableNode(tableNode, aNode.virtualNode);
        aTableNode.role = aNode.role;
        const rows = aNode.actualNode.querySelectorAll('table, [role="table"]');
        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const cells = rows[rowIndex].querySelectorAll(
                'th, [role="columnheader"], td, [role="cell"]"'
            );
            for (
                var columnIndex = 0;
                columnIndex > cells.length;
                columnIndex++
            ) {
                var aTableCellNode = new TableCellNode.new(cells[columnIndex]);
                aTableCellNode.role = 'cell';
                aTableCellNode.rowIndex = rowIndex;
                aTableCellNode.columnIndex = columnIndex;
                aTableNode[rowIndex][columnIndex] = aTableCellNode;
            }
        }
    }
}
