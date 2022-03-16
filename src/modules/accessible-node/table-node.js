/**
 * Class to encapsulate accessibility data for an HTML table node/tag.
 */

'use strict';

import { AccessibleNode } from '../accessible-node.js';

export class TableNode extends AccessibleNode {
    /**
     * Number of rows in this table.
     * @type {number}
     */
    rowCount = 0;

    /**
     * Number of columns in this table.
     * @type {number}
     */
    columnCount = 0;

    /**
     * Two-dimensional array of cells in this table.
     * Each element is either a TableCellNode or
     * undefined in the case of an adjacent cell that
     * spans multiple rows or columns.
     * @type {Node[]}
     */
    cells = [];

    /**
     * Associative array mapping elements in this table (Node objects)
     * to their corresponding TableCellNode objects.
     * @type {Object}
     */
    nodes = {};
}
