/**
 * Class to represent a screen reader quick key to iterate through a set of
 * tags in the DOM when a certain key is pressed.
 */

 export class QuickKey {

    // Key to press to advance to the next node.
    key = null;

    // CSS selector for DOM nodes matched by this quick key.
    selector = '';

    // List of nodes that that match this quick key.
    nodes = [];

    // Index of current node in list of nodes.
    currentNodeIndex = -1;

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
 }