/**
 * @class
 * Class to encapsulate accessibility data for an HTML table cell node/tag.
 */

'use strict';

import { AccessibleNode } from '../accessible-node.js';

export class TableCellNode extends AccessibleNode {
    /**
     * @member
     * Index of this cell in its table's list of rows.
     */
    rowIndex = -1;

    /**
     * @member
     * Index of this cell in its table's list of colums.
     */
    columnIndex = -1;

    /**
     * @member
     * Number of rows spanned by this cell.
     */
    rowSpan = 1;

    /**
     * @member
     * Number of columns spanned by this cell.
     */
    columnSpan = 1;

    /**
     * @member
     * Text of the heading cell in this cell's table row.
     */
    rowHeading = undefined;

    /**
     * @member
     * Text of the heading cell in this cell's table column.
     */
    columnHeading = undefined;

    /**
     * @member
     * Type of this table cell -- either 'cell' or 'heading'.
     */
    cellType = 'cell';

    /**
     * @member
     * The table this cell is part of.
     */
    table = undefined;
}
