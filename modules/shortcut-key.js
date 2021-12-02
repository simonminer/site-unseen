/**
 * @class
 * Class to represent a screen reader shortcut key to iterate through a set of
 * tags in the DOM when a certain key is pressed.
 */

'use strict';

import { ElementList } from './element-list.js';

export class ShortcutKey extends ElementList {
    // Key to press to advance to the next node.
    key = undefined;

    // CSS selector for DOM nodes matched by this shortcut key.
    selector = '';

    /**
     * @constructor
     *
     * @param {String} key - Key to press to advance to the next node.
     * @param {String} selector - CSS selector for DOM nodes matched by this shortcut key
     * @param {Node} rootNode - Root node against which selector is run (optional).
     * @returns {ShortcutKey} - A new instance of the ShortcutKey class.
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
