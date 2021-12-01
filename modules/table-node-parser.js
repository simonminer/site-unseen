/**
 * @class
 * Class to parse HTML tables into accessible data structures.
 */

 "use strict";

 import { NodeParser } from "./node-parser.js";

 export class TableNodeParser extends NodeParser {

     /**
      * @member
      * Number of rows in this table.
      */
     rowCount = 0;

     /**
      * @member
      * @static
      * Associateive array mapping table nodes (Node objects)
      * to their corresponding TableNode objects.
      */
     static tables = {};
 }
