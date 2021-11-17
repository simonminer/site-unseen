/**
 * @class
 * Class to parse HTML tags for accessibility information.
 */
"use strict";

// Set up axe-core.
// import axe from "axe-core";
var virtualTree = undefined;
if (window.axe == undefined) {
    window.axe = require("axe-core");
}

export class TagParser {

    /**
     * @member
     * Root node from which the virtual Dom tree starts.
     */
    rootNode = document.body;

    /**
     * @member
     * Flattened virtual DOM tree produced by the axe-core library.
     */
    virtualTree = undefined;

    /**
     * @member
     * List of tags without ARIA roles.
     */
    tagsWithoutRole = {
        caption: 'table caption',
        dd: 'list item',
        dl: 'list',
        dt: 'list item',
        li: 'list item',
        td: 'table cell',
        th: 'table heading',
        tr: 'table row'
    };

    static _properties = ['tagsWithoutRole', 'rootNode', 'virtualTree'];

    /**
     * @constructor
     * @param {Object} properties - Set of key/value pairs to override the default properties of this class.
     */
    constructor(properties) {
        if (properties !== undefined) {
            TagParser._properties.forEach(property => {
                if (properties.hasOwnProperty(property)) {
                    this[property] = properties[property];
                }
            });
        }
        this.virtualTree = this.generateTree(this.rootNode);
    }

    /**
     * @method
     * Generates and returns a flattened virtual node tree
     * using the axe-core library. This tree is usded to
     * extract accessibility information from tags.
     * @param {Node} rootNode - The root node of the virtual tree
     * @returns {tree}
     */
    generateTree(rootNode) {
        const tree = axe.utils.getFlattenedTree(rootNode);
        return tree;
    }

    /**
     * @method
     * Extracts or infers the accessible role, name, and value
     * of the specified node, returning them in an associative
     * array with keys of "role", "name", and "value". Values in
     * this array which could not be computed are
     * set to undefined if they could 
     * @param {Element} node - The HTML node/tag to parse for accessible details.
     * @returns {Object}
     */
    parse(node) {

        var data = {
            'role': undefined,
            'name': node.hasAttribute('name') ? node.getAttribute('name') : undefined,
            'value': undefined
        };
        var tagName = node.tagName.toLowerCase();

        // TODO: Create axe tree from screen reader root when
        // content is initially loaded and look up the desired
        // node here.
        if (this.tagsWithoutRole[tagName] === undefined) {
            data['role'] = axe.commons.aria.getRole(node, this.virtualTree);
        }
        if (data['role'] !== undefined) {
            data['value'] = axe.commons.text.accessibleText(node, this.virtualTree);
        }
        else {
            data['role'] = this.tagsWithoutRole[tagName];
            data['value'] = node.textContent;
        }

        // Add tag-specific data.
        if (data['role'] === 'heading') {
            var headingLevel = this.parseHeadingLevel(node);
            if (headingLevel) {
                data['role'] += ` level ${headingLevel}`;
            }
        }

        return data;
    }

    /**
     * @method
     * Returns the numeric heading level associated with
     * the specified node or undefined if none is found.
     * @param {Element} node - The heading element being parsed.
     * @returns {String}
     */
     parseHeadingLevel(node) {
         var headingLevel = undefined;
         if (node.hasAttribute('aria-level')) {
             headingLevel = node.getAttribute('aria-level')
         }
         else {
             var headingData = node.tagName.toUpperCase().match(/H(\d)/);
             if (headingData && headingData instanceof Array) {
                headingLevel = headingData[1];
             }
         }
         return headingLevel;
     }
}
