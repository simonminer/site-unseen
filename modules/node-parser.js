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
        dd: 'definition',
        dl: 'definition list',
        dt: 'term',
        li: 'listitem',
        td: 'table cell',
        th: 'table heading',
        tr: 'table row'
    };

    /**
     * @member
     * List of roles corresponding to page regions/landmarks.
     */
    // TODO Should the "region" role be included in this list?
    landmarkRoles = [
        'application', 'banner', 'complementary', 'contentinfo',
        'form', 'main', 'navigation', 'search'
    ];

    /**
     * @member
     * List of roles for form field elements.
     */
    formFieldRoles = [
        'button', 'checkbox', 'combobox', 'option', 'radio', 'textbox'
    ];
    static _properties = ['tagsWithoutRole', 'landmarkRoles', 'rootNode', 'virtualTree'];

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
     * using the axe-core library. This tree is used to
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

        // Compute node metadata.

        // Determine the heading level.
        if (aNode.role === 'heading') {
            var headingLevel = this.parseHeadingLevel(aNode);
            if (headingLevel) {
                aNode.metadata = `level ${headingLevel}`;
            }
        }

        // Count the number of items in a list.
        else if (aNode.role === 'list') {
            var listItemCount = this.countListItems(aNode);
            if (listItemCount !== undefined) {
                var itemText = listItemCount == 1 ? 'item' : 'items';
                aNode.metadata = `(${listItemCount} ${itemText})`;
            }
        }

        // Figure out the position of a list item in its list.
        else if (aNode.role === 'listitem') {
            var parentNode = this.parse(node.parentNode);
            parentNode.virtualNode = axe.commons.utils.getNodeFromTree(this.virtualTree, node.parentNode);
            const listItems = this.getListItemChildren(parentNode);
            var listItemIndex = -1;
            for (var i = 0, l = listItems.length; i < l; i++) {
                if (listItems[i].actualNode === node) {
                    listItemIndex = i;
                    break;
                }
            }
            if (listItemIndex !== -1 && listItems.length >= 0 ) {
                aNode.metadata = `(${listItemIndex + 1} of ${listItems.length})`;
            }
        }

        // Highlight when a role corresponds with a page region/landmark.
        else if (this.landmarkRoles.includes(aNode.role)) {
            aNode.metadata = "region";
        }

        // Set form element names and values.
        else if (this.formFieldRoles.includes(aNode.role)) {
            this.parseFormField(aNode);
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
     * Returns an array of AccessibleNode objects corresponding
     * to the children of the specified AccessibleNode with
     * the listitem role.
     * @param {AccessibleNode} listNode - The AccessibleNode for the list element whose list item children are being counted
     * @return {Array[AccessibleNode]}
     */
    getListItemChildren(listNode) {
        var listItemChildren = [];
        if (listNode.role === 'list') {
            const children = listNode.virtualNode.children;
            for (var i = 0, l = children.length; i < l; i++) {
                var childRole = axe.commons.aria.getRole(children[i], this.virtualTree);
                if (childRole === 'listitem') {
                    var listItem = new AccessibleNode(children[i].actualNode, children[i]);
                    listItem.role = childRole;
                    listItemChildren.push(listItem);
                }
            }
         }
        return listItemChildren;
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

        // Find children with listitem roles.
        var listItemChildren = this.getListItemChildren(listNode);
        return listItemChildren.length;
    }

    /**
     * @method
     * Sets form field ata appropriate based on its type and role
     * @param {AccessibleNode} formFieldNode - The accessibility for the form field element.
     */
    parseFormField(formFieldNode) {
        var node = formFieldNode.actualNode;
        if (formFieldNode.role === 'button') {
            if (formFieldNode.value && formFieldNode.value.length > 0) {
                formFieldNode.name = node.value ? node.value : formFieldNode.value;
                formFieldNode.value = '';
            }
        }
        else if (formFieldNode.role === 'radio' && formFieldNode.virtualNode.parent) {
            formFieldNode.name = formFieldNode.value;

            // Incorporate details about the radio button group into the accessible node data.
            const parentNode = this.parse(formFieldNode.virtualNode.parent.actualNode);
            if (parentNode.role === 'group') {
                formFieldNode.name = parentNode.value;
                var radioButtons = [];
                parentNode.virtualNode.children.forEach( child => {
                    const childRole = axe.commons.aria.getRole(child, this.virtualTree);
                    if (childRole === 'radio') {
                        radioButtons.push(child.actualNode);
                    }
                });
                const radioButtonIndex = radioButtons.indexOf(formFieldNode.actualNode) + 1;
                if (radioButtons.length > 0 && radioButtonIndex > 0) {
                    formFieldNode.metadata = `(${radioButtonIndex} of ${radioButtons.length})`;
                }
            }
            else {
                formFieldNode.value = node.value;
            }
        }
        else {
            formFieldNode.name = formFieldNode.value;
            formFieldNode.value = node.value;
        }
    }
}
