/**
 * @class
 * Class to represent a screen reader quick key to iterate through a set of
 * tags in the DOM when a certain key is pressed.
 */

 "use strict";

 import { ElementList } from "./element-list.js";

 export class QuickKey extends ElementList {

    // Key to press to advance to the next node.
    key = undefined;

    // CSS selector for DOM nodes matched by this quick key.
    selector = '';

    /**
     * @constructor
     *
     * @param {String} key - Key to press to advance to the next node.
     * @param {String} selector - CSS selector for DOM nodes matched by this quick key
     * @param {Node} rootNode - Root node against which selector is run (optional).
     * @returns {QuickKey} - A new instance of the QuickKey class.
     */
    constructor(key, selector, rootNode = null) {
        super(selector, rootNode);
        this.key = key;
        this.selector = selector;
        if (rootNode) {
            this.nodes = this.findNodes(this.selector, rootNode);
        }
    }
 }
