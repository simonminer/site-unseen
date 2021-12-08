/**
 * Class to encapsulate accessibility data for an HTML table cell node/tag.
 */

'use strict';

import { AccessibleNode } from '../accessible-node.js';

class TableCellNode extends AccessibleNode {
    /**
     * Index of this cell in its table's list of rows.
     * @type {number}
     */
    rowIndex = -1;

    /**
     * Index of this cell in its table's list of colums.
     * @type {number}
     */
    columnIndex = -1;

    /**
     * Number of rows spanned by this cell.
     * @type {number}
     */
    rowSpan = 1;

    /**
     * Number of columns spanned by this cell.
     * @type {number}
     */
    columnSpan = 1;

    /**
     * Text of the heading cell in this cell's table row.
     * @type {string}
     */
    rowHeading = undefined;

    /**
     * Text of the heading cell in this cell's table column.
     * @type {string}
     */
    columnHeading = undefined;

    /**
     * Type of this table cell -- either 'cell' or 'heading'.
     * @type {string}
     */
    cellType = 'cell';

    /**
     * The TableNode representing the table which this cell is part of.
     * @type {TableNode}
     */
    table = undefined;
}

module.exports = {
    TableCellNode
}
