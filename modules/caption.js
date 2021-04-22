/**
 * @class
 * Class to represent the screen reader caption which displays
 * the role, state/property, and value of an HTML element.
 */
"use strict";

// Set up axe-core.
import axe from "axe-core";

export class Caption {

    // Caption CSS selector values.
    id = "caption";
    textColor = '#ffffff';
    backgroundColor = "#000000";
    borderColor = "#ffffff";
    borderWidth = "3 px";

    // Separator between elements of the accessible description.
    separator = ": ";

    static _properties = ["id", "textColor", "backgroundColor", "borderColor", "borderWidth", "separator"];

    /**
     * @constructor
     * @param {Object} properties - Set of key/value pairs to override the default properties of this class.
     */
    constructor(properties) {
        if (properties !== undefined) {
            Caption._properties.forEach(property => {
                if (properties.hasOwnProperty(property)) {
                    this[property] = properties[property];
                }
            });
        }
    }

    /**
     * @method
     * @param {Node} node - Node to describe in the caption.
     * @returns {String}
     * Generates and returns an accessible description of the
     * role, state/property, and/or value of the specified node.
     */
    generate(node) {
        axe._tree = axe.utils.getFlattenedTree(node);
        var role = axe.commons.aria.getRole(node, axe._tree),
            accessibleText = axe.commons.text.accessibleText(node, axe._tree),
            data = [];

        if (role) {
            data.push(role);
        }
        if (accessibleText) {
            data.push(accessibleText);
        }
        return data.join(": ");
    }
}
