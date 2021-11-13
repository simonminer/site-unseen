/**
 * @class
 * Class to represent the screen reader caption which displays
 * the role, state/property, and value of an HTML element.
 */
"use strict";

import { TagParser } from "./tag-parser.js";

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
     * Instance of the TagParser class used to generate text for this caption.
     */
    tagParser = new TagParser;

    static _properties = ["id", "css", "separator", "tagParser"];

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
     * role, name,  state/property, and/or value of the specified node.
     * @param {Node} node - Node to describe in the caption.
     * @returns {String}
     */
    generate(node) {
        const data = this.tagParser.parse(node);
        var values = [];
        ['role', 'name', 'value'].forEach( (key) => {
            if (data[key] !== undefined && data[key] !== null) {
                values.push(data[key]);
            }
        });
        const text = values.join(this.separator);
        return text;
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
