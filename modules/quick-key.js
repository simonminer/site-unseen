/**
 * @class
 * Class to represent a screen reader quick key to iterate through a set of
 * tags in the DOM when a certain key is pressed.
 */

 "use strict";
 
 export class QuickKey {

    // Key to press to advance to the next node.
    key = undefined;

    // CSS selector for DOM nodes matched by this quick key.
    selector = '';

    // List of nodes that that match this quick key.
    nodes = [];

    // Index of current node in list of nodes.
    currentNodeIndex = -1;

    // Type of wrap-around when a quick key is pressed on its
    // first or last instance of its list of nodes:
    // values include "start" or "end".
    wrappedTo = undefined;

    /**
     * @constructor
     *
     * @param {String} key - Key to press to advance to the next node.
     * @param {String} selector - CSS selector for DOM nodes matched by this quick key
     * @param {Node} rootNode - Root node against which selector is run (optional).
     * @returns {QuickKey} - A new instance of the QuickKey class.
     */
    constructor(key, selector, rootNode = null) {
        this.key = key;
        this.selector = selector;
        if (rootNode) {
            this.nodes = this.findNodes(rootNode);
        }
    }

    /**
     * Finds and returns a list of nodes which matches the object's selector property.
     * @method
     * @param {NodeListOf} rootNode - Root node against which selector is run.
     * @returns {Array[Node]} - List of nodes matching the object's selector.
     */
    findNodes(rootNode) {
        var nodes = [];
        if (rootNode) {
            nodes = rootNode.querySelectorAll(this.selector);
        }
        return nodes;
    }

    /**
     * Returns the current node matched by this quick key.
     * @method
     * @returns {Node} - The current matching node or undefined if there are none
     * or the list of nodes has not been traversed yet.
     */
    currentNode() {
        if (!this.nodes.length || this.currentNodeIndex < 0) {
            return;
        }
        return this.nodes[this.currentNodeIndex];
    }

    /**
     * Returns the next node in the DOM matched by this quick key.
     * @method
     * @returns {Node} - The next matching node (which could be the first one
     * if we are at the end of the list), or undefined if there are no matching nodes.
     */
    nextNode() {
        // Clear wrap-around.
        this.wrappedTo = undefined;

        // Make sure there are matching nodes for this quick key.
        if (!this.nodes.length) {
            return;
        }

        // Return this node if it's the only one in the list.
        if (this.nodes.length == 1) {
            this.currentNodeIndex = 0;
        }
        // Get the next node in the list.
        else if (this.currentNodeIndex < this.nodes.length - 1) {
            this.currentNodeIndex += 1;
        }
        // Or loop around to to the start of the list if we are at the end.
        else {
           this.currentNodeIndex = 0;
           this.wrappedTo = "start";
        }

        return this.nodes[this.currentNodeIndex];   
    }

     /**
     * Returns the previous node in the DOM matched by this quick key.
     * @method
     * @returns {Node} - The previous matching node (which could be the last one 
     * if we are at the start of the list), or null if there are no matching nodes.
     */
    previousNode() {
        // Clear wrap-around.
        this.wrappedTo = undefined;

        // Make sure there are matching nodes for this quick key.
        if (!this.nodes.length) {
            return;
        }

        // Return this node if it's the only one in the list.
        if (this.nodes.length == 1) {
            this.currentNodeIndex = 0;
        }        
        // Get the previous node in the list.
        else if (this.currentNodeIndex > 0) {
            this.currentNodeIndex -= 1;
        }
        // Or loop around to to the start of the list if we are at the end.
        else {
           this.currentNodeIndex = this.nodes.length - 1;
           this.wrappedTo = "end";       
        }
        return this.nodes[this.currentNodeIndex];   
    }
 }