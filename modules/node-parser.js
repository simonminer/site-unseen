/**
 * @class
 * Class to parse HTML nodes for accessibility information.
 */
"use strict";

import { AccessibleNode } from './accessible-node.js';

// Set up axe-core.
var virtualTree = undefined;
if (window.axe == undefined) {
    window.axe = require("axe-core");
}

export class NodeParser {

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
        dd: 'listitem',
        dl: 'list',
        dt: 'listitem',
        li: 'listitem',
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
            NodeParser._properties.forEach(property => {
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
     * extract accessibility information from nodes.
     * @param {Node} rootNode - The root node of the virtual tree
     * @returns {tree}
     */
    generateTree(rootNode) {
        const tree = axe.utils.getFlattenedTree(rootNode);
        return tree;
    }

    /**
     * @method
     * Extracts or infers the accessible role, name, value,
     * and other metadata of the specified node,
     * returning an AccessibleNode object containing this data.
     * @param {Element} node - The HTML node/tag to parse for accessible details.
     * @returns {AccessibleNode}
     */
    parse(node) {

        var aNode = new AccessibleNode(node);
        aNode.virtualNode = axe.commons.utils.getNodeFromTree(this.virtualTree, node);

        // Compute the node's role and value.
        if (this.tagsWithoutRole[aNode.tagName] === undefined) {
            aNode.role = axe.commons.aria.getRole(node, this.virtualTree);
        }
        if (aNode.role !== undefined) {
            aNode.value = axe.commons.text.accessibleText(node, this.virtualTree);
        }
        else {
            aNode.role = this.tagsWithoutRole[aNode.tagName];
            aNode.value = node.textContent;
        }

        // Add node-specific data.
        if (aNode.role === 'heading') {
            var headingLevel = this.parseHeadingLevel(aNode);
            if (headingLevel) {
                aNode.metadata = `level ${headingLevel}`;
            }
        }
        else if (aNode.role === 'list') {
            var listItemCount = this.countListItems(aNode);
            if (listItemCount !== undefined) {
                var itemText = listItemCount == 1 ? 'item' : 'items';
                aNode.metadata = `(${listItemCount} ${itemText})`;
            }
            
        }

        return aNode;
    }

    /**
     * @method
     * Returns the numeric heading level associated with
     * the specified node or undefined if none is found.
     * @param {AccessibleNode} headingNode - AccessibleNode for the heading element being parsed.
     * @returns {String}
     */
     parseHeadingLevel(headingNode) {

         // Verify this node has a heading role.
         if (headingNode.role !== 'heading') {
             return undefined;
         }

         // Tags with ARIA heading roles need an aria-level attribute.
         var headingLevel = undefined;
         if (headingNode.virtualNode.hasAttr('aria-level')) {
             headingLevel = headingNode.virtualNode.attr('aria-level')
         }
         // Parse the heading level from the tag.
         else {
             var headingData = headingNode.tagName.toUpperCase().match(/H(\d)/);
             if (headingData && headingData instanceof Array) {
                headingLevel = headingData[1];
             }
         }
         return headingLevel;
     }

    /**
     * @method
     * Returns the number of list items in the given list node
     * or undefined if something goes wrong.
     * @param {AccessibleNode} listNode - The AccessibleNode for the list element whose list item children are being counted
     * @returns {integer}
     */
    countListItems(listNode) {

         // Verify this node has a role of list.
         if (listNode.role !== 'list') {
             return undefined;
         }

        // TODO Find children with listitem roles (to account for list ARIA role).
        var listItemCount = listNode.actualNode.getElementsByTagName('li').length;

        // TODO Handle definition lists appropriately. (Maybe they shouldn't be lists at all?)

        return listItemCount;
    }
}
