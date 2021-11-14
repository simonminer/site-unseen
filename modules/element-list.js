/**
 * @class
 * Base class to represent a list of HTML nodes/elements
 * matching some condition.
 */

 "use strict";
 
 export class ElementList {

     /**
      * @member
      * List of nodes that that match this element list.
      */
    nodes = [];

     /**
      * @member
      * Index of the current element in the object's list of nodes.
      */
    currentNodeIndex = -1;

     /**
      * @member
      * Type of wrap-around when a node is requested before
      * the first or after the last node in the list.
      * values include "start" or "end".
      */
    wrappedTo = undefined;

    /**
     * @constructor
     * @param {String} or {Function} finder - CSS selector or function to build the list of nodes.
     * @param {Node} rootNode - Root node against which selector is run (optional). (defaults to document body).
     * @returns {ElementList} - A new instance of the ElementList class.
     */
    constructor(finder, rootNode = document.body) {
        if (finder) {
            this.nodes = this.findNodes(finder, rootNode);
        }
    }

    /**
     * @method
     * Finds and returns a list of nodes which matches the specified finder CSS selector or function.
     * @param {String} or {Function} finder - CSS selector or function to build the list of nodes.
     * - If this parameter is a Function, it takes the node being processed as an argument and return a boolean
     *   value indicating whether or not the node belongs in this element list.
     * @param {Node} rootNode - Root node against which selector is run (optional). (defaults to document body).
     * @returns {Array[Node]} - List of nodes matching the object's selector.
     */
    findNodes(finder, rootNode = null) {
        var nodes = [];
        var finderType = "selector";
        var selector = finder;
        // Test all nodes beneath the root node if a function
        // was passed to build the element list.
        if (typeof selector != "string") {
            finderType = "function";
            selector = '*';
        }

        if (!rootNode) {
            rootNode = document.body;
        }

        rootNode.querySelectorAll(selector).forEach( node => {
            if (finderType === "selector" || (finderType === "function" && finder(node))) {
                nodes.push(node);
            }
        });

        return nodes;
    }

    /**
     * @method
     * Returns the current node matched by this element list.
     * @param {Node} node - The node being set to the new current node in this list (optional).
     * @returns {Node} - The current matching node or undefined if there are none
     * or the list of nodes has not been traversed yet.
     */
    currentNode(node) {
        // Make sure there are nodes in this element list.
        if (!this.nodes.length) {
            return;
        }

        // find and assign the new current node.
        if (node) {
            const nodeIndex = this.nodes.indexOf(node);
            if (nodeIndex >= 0) {
                this.currentNodeIndex = nodeIndex;
            }
            else {
                this.currentNodeIndex = -1;
                return;
            }
        }

        // Update the current Node
        return this.nodes[this.currentNodeIndex];
    }

    /**
     * @method
     * Returns the next node in the DOM matched by this element list.
     * @returns {Node} - The next matching node (which could be the first one
     * if we are at the end of the list), or undefined if there are no matching nodes.
     */
    nextNode() {
        // Clear wrap-around.
        this.wrappedTo = undefined;
        var index = this.currentNodeIndex;

        // Make sure there are matching nodes for this element list.
        if (!this.nodes.length) {
            return;
        }

        // Return this node if it's the only one in the list.
        if (this.nodes.length == 1) {
            index = 0;
        }
        // Get the next node in the list.
        else if (this.currentNodeIndex < this.nodes.length - 1) {
            index += 1;
        }
        // Or loop around to to the start of the list if we are at the end.
        else {
           index = 0;
           this.wrappedTo = "start";
        }

        return this.nodes[index];   
    }

     /**
     * @method
     * Returns the previous node in the DOM matched by this element list.
     * @returns {Node} - The previous matching node (which could be the last one 
     * if we are at the start of the list), or null if there are no matching nodes.
     */
    previousNode() {
        // Clear wrap-around.
        this.wrappedTo = undefined;
        var index = this.currentNodeIndex;

        // Make sure there are matching nodes for this element list.
        if (!this.nodes.length) {
            return;
        }

        // Return this node if it's the only one in the list.
        if (this.nodes.length == 1) {
            index = 0;
        }        
        // Get the previous node in the list.
        else if (this.currentNodeIndex > 0) {
            index -= 1;
        }
        // Or loop around to to the start of the list if we are at the end.
        else {
           index = this.nodes.length - 1;
           this.wrappedTo = "end";       
        }
        return this.nodes[index];   
    }
 }
