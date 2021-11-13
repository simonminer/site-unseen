/**
 * @class
 * Class to represent the screen reader caption which displays
 * the role, state/property, and value of an HTML element.
 */
"use strict";

// Set up axe-core.
// import axe from "axe-core";
if (window.axe == undefined) {
    window.axe = require("axe-core");
}

export class Caption {

    /**
     * @member
     * ID of caption element in DOM.
     */
    id = "caption";

    /**
     * @member
     * Caption node in DOM.
     */
    node = undefined;

    /**
     * Caption CSS selector name/value pairs.
     */
    css = {
        "color": '#ffffff',
        "background-color": "#000000",
        "border": "3px solid #ffffff",
        "border-radius": "10px",
        "font-size": "1.3rem",
        "font-weight": "bold",
        "padding": "10px",
        "width": "40%",
        "height": "20%",
        "position": "fixed",
        "bottom": "10px",
        "right": "10px",
        "text-align": "left"
    };

    /**
     * @member
     * Separator between elements of the accessible description.
     */
    separator = ": ";

    /**
     * @member
     * List of tags without ARIA roles.
     */
    tagsWithoutRoles = ['dd', 'dt', 'li',];

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
     * Generates and returns an accessible description of the
     * role, state/property, and/or value of the specified node.
     * @param {Node} node - Node to describe in the caption.
     * @returns {String}
     */
    generate(node) {
        axe._tree = axe.utils.getFlattenedTree(node);
        var tagName = node.tagName.toLowerCase(),
            role = this.tagsWithoutRoles.indexOf(tagName) === -1
                ? axe.commons.aria.getRole(node, axe._tree, {noPresentational: true}) : undefined,
            accessibleText = "",
            data = [];
        if (role !== undefined) {
            accessibleText = axe.commons.text.accessibleText(node, axe._tree);
        }
        else {
            // TODO Turn tagsWithoutRoles into map from tab name to role text.
            role = "list item";
            accessibleText = node.innerText;
        }

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
     * Generates the <style> HTML element for the caption CSS styles
     * @returns {Element}
     */
    getCSS() {
        var cssProperties = [];
        for (const property in this.css) {
            if (Object.hasOwnProperty.call(this.css, property)) {
                cssProperties.push(property + ": " + this.css[property]);
            }
        }
        var css = `#${this.id} { ${cssProperties.join("; ")}; }`;
        var node = document.createElement('style');
        node.appendChild(document.createTextNode(css));
        return node;
      }

    /**
     * @method
     * Generates the HTML element for the screen reader caption
     * and stores it in this object's node attribute.
     * @returns {Element}
     */
    getHTML() {
        var node = document.createElement('div');
        node.setAttribute("id", this.id);
        this.node = node;
        return node;
    }
}
