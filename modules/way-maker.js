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

    static _properties = ["className"];

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
    }

    /**
     * @method
     * @param {Node} rootNode - Top-level node from which to find and process elements
     * Parses the DOM starting from the specified root node,
     * finding and flagging nodes that are navigable by the screen reader.
     */
    markNavigableNodes(rootNode) {
    }
}
