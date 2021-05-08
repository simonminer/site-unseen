/**
 * @class
 * Class to parse the DOM for navigable elements
 * and mark them as such
 *
 * "Even when I can't see it your working..."
 */
"use strict";

export class WayMaker {

    /**
     * @member
     * CSS class assigned to elements that are navigable by the screen reader.
     */
    className = "srn";

    /**
     * HTML tag lists are taken from https://developer.mozilla.org/en-US/docs/Web/HTML/Element.
     * 
     * @member
     * List of interactive HTML tags. These are
     * already in the tab order, but the also need
     * to be navigable via screen reader controls.
     */
    interactiveTags = ["button", "datalist", "input", "option", "select", "textarea"];

    /**
     * @member
     * List of non-interactive HTML tags that should be
     * navigable by the screen reader.
     */
    nonInteractiveTags = [
        "address", "area", "audio", "blockquote",
        "caption", "dd", "dl", "dt", "figcaption", "figure",
        "h1", "h2", "h3", "h4", "h5", "h6", "img",
        "label", "legend", "li", "map", "math", "ol",
        "p", "pre", "progress", "svg", "table", "td",
        "th", "tr", "track", "ul", "video"
    ];

    /**
     * @member
     * List of HTML tags that could potentially 
     * be navigable by the screen reader,
     * depending on their contents.
     */
    potentiallyNavigableTags = ["div","span"];

    /**
     * @member
     * Number of nodes that have been assigned
     * tabindex attributes by this object.
     */
    tabIndexNodeCount = 0;

    /**
     * @member
     * List of nodes that can be navigated
     * by the screen reader
     */
    nodes = [];

    /**
     * @member
     * Index of current node in list of navigable odes.
     */
     currentNodeIndex = -1;

    /**
     * @member
     * Type of wrap-around when the screen reader reaches the
     * first or last navigable node:
     * values include "start" or "end".
     */
    wrappedTo = undefined;
    static _properties = ["className", "tabIndexNodeCount", "nodes", "wrappedTo"];

    /**
     * @constructor
     * @param {Object} properties - Set of key/value pairs to override the default properties of this class.
     */
    constructor(properties) {
        if (properties !== undefined) {
            WayMaker._properties.forEach(property => {
                if (properties.hasOwnProperty(property)) {
                    this[property] = properties[property];
                }
            });
        }
    }

    /**
     * @method
    * @param {Node} node - The HTML element being for considered for a tabindex attribute.
    * @returns {boolean}
    * Tests whether or not the given HTML node needs a tabindex="-1"
    * attribute so that it can receive keyboard focus 
    */
    isTabIndexNeeded(node) {
        var tagName = node.tagName.toLowerCase();
        var isNeeded = false;

        // Is the node non-interactive?
        if (this.nonInteractiveTags.includes(tagName)) {
            isNeeded = true;
        }
        // Does the node have at least one child that contains text?
        else if (this.potentiallyNavigableTags.includes(tagName)) {
            var children = node.childNodes;
            for (let i = 0; i < children.length; i++) {
                if (children[i].nodeType === 3 && children[i].nodeValue.trim() !== "") {
                    isNeeded = true;
                    break;
                }
            }
        }

        return isNeeded;
    }
    
    /**
     * @method
     * @param {Node} node - The HTML element to be processed.
     * Examines the specified HTML node, flagging it appropriately
     * if it can be navigated by a screen reader.
     */
    processNode(node) {
        // If the screen reader should be able to navigate
        // this node, make sure it has a tabindex attribute.
        var isTabIndexNeeded = this.isTabIndexNeeded(node);
        if (isTabIndexNeeded) {
            node.setAttribute("tabindex", "-1");
            this.tabIndexNodeCount += 1;
        }

        // Assign a special class to the node if can be navigated
        // by the screen reader.
        var tagName = node.tagName.toLowerCase();
        if (isTabIndexNeeded || this.interactiveTags.includes(tagName)) {
            node.classList.add(this.className);
            this.nodes.push(node);
        }
    }

    /**
     * @method
     * @param {Node} rootNode - Top-level node from which to find and process elements
     * Parses the DOM starting from the specified root node,
     * finding and flagging nodes that are navigable by the screen reader.
     */
    markNavigableNodes(rootNode) {
        rootNode.querySelectorAll('*').forEach(node => {
            this.processNode(node);
        });
    }

    /**
     * @method
     * @returns {Node} - The current matching node or undefined if there are none
     * Returns the current node navigable by the screen reader.
     * or the list of nodes has not been traversed yet.
     */
    currentNode() {
        if (!this.nodes.length || this.currentNodeIndex < 0) {
            return;
        }
        return this.nodes[this.currentNodeIndex];
    }
    
    /**
     * @method
     * @returns {Node} - The next matching node (which could be the first one)
     * Returns the next node in the DOM navigable by the screen reader.
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
      * @method
      * @returns {Node} - The previous matching node (which could be the last one)
     * Returns the previous node in the DOM navigable by the screen reader.
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
