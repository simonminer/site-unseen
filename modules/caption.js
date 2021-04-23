/**
 * @class
 * Class to represent the screen reader caption which displays
 * the role, state/property, and value of an HTML element.
 */
"use strict";

// Set up axe-core.
import axe from "axe-core";

export class Caption {

    id = "caption";
    // Caption CSS selector values.
    css = {
        "text-color": '#ffffff',
        "background-color": "#000000",
       "border-color": "#ffffff",
        "border-width": "3px",
        "font-weight": "bold",
        "padding": "10px",
        "width": "20%",
        "height": "12%",
        "position": "fixed",
        "bottom": "10px",
        "right": "10px",
        "text-align": "left"
    };

    // Separator between elements of the accessible description.
    separator = ": ";

    static _properties = ["id", "css", "separator"];

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

    /**
     * @method
     * @returns {String}
     * Generates the HTML for the screen reader capture element.
     */
    html() {
        var cssProperties = [];
        for (const property in this.css) {
            if (Object.hasOwnProperty.call(this.css, property)) {
                cssProperties.push(property + ": " + this.css[property]);
            }
        }
        var html = `
<style>
#{this.id} {
    ${cssProperties.join(";\n    ")};
}
</style>
<div id="${this.id}"></div>
 `;
        return html;
    }
}
