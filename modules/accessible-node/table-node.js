/**
 * @class
 * Class to encapsulate accessibility data for an HTML table node/tag.
 */

 "use strict";

import { AccessibleNode } from "../accessible-node.js";

 export class TableNode extends AccessibleNode {

     /**
      * @member
      * Number of rows in this table.
      */
     rowCount = 0;

     /**
      * @member
      * Number of columns in this table.
      */
      columnCount = 0;

     /**
      * @member
      * Two-dimensional array of cells in this table.
      * Each element is either a TableCellNode or
      * undefined in the case of an adjacent cell that
      * spans multiple rows or columns.
      */
      cells = [];

     /**
      * @member
      * Associative array mapping elements in this table (Node objects)
      * to their corresponding TableCellNode objects.
      */
      nodes = {};
 }
