/**
 * @class
 * Class to parse HTML tags for accessibility information.
 */
"use strict";

// Set up axe-core.
// import axe from "axe-core";
var axeTree = undefined;
if (window.axe == undefined) {
    window.axe = require("axe-core");
}

export class TagParser {

    /**
     * @member
     * Flattened DOM tree produced by the axe-core library.
     */
    axeTree = axe._Tree;

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

    static _properties = ['tagsWithoutRole'];

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

        axe._tree = axe.utils.getFlattenedTree(node);
        if (this.tagsWithoutRole[tagName] === undefined) {
            data['role'] = axe.commons.aria.getRole(node, axe._tree);
        }
        if (data['role'] !== undefined) {
            data['value'] = axe.commons.text.accessibleText(node, axe._tree);
        }
        else {
            data['role'] = this.tagsWithoutRole[tagName];
            data['value'] = node.textContent;
        }

        return data;
    }
}
