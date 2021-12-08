/**
 * Class to represent the screen reader caption which displays
 * the role, state/property, and value of an HTML element.
 */
'use strict';

import { NodeParser } from './node-parser.js';

class Caption {
    /**
     * ID of caption element in DOM.
     * @type {string}
     */
    id = 'caption';

    /**
     * Caption node in DOM.
     * @type {Node}
     */
    node = undefined;

    /**
     * Caption CSS selector name/value pairs.
     * @type {string}
     */
    css = {
        color: '#ffffff',
        'background-color': '#000000',
        border: '3px solid #ffffff',
        'border-radius': '10px',
        'font-size': '1.3rem',
        'font-weight': 'bold',
        padding: '10px',
        width: '40%',
        height: '20%',
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        'text-align': 'left'
    };

    /**
     * Separator between elements of the accessible description.
     * @type {string}
     */
    separator = ': ';

    /**
     * Instance of the NodeParser class used to generate text for this caption.
     * @type {NodeParser}
     */
    nodeParser = new NodeParser();

    static _properties = ['id', 'css', 'separator', 'nodeParser'];

    /**
     * @param {Object} properties - Set of key/value pairs to override the default properties of this class.
     */
    constructor(properties) {
        if (properties !== undefined) {
            Caption._properties.forEach((property) => {
                if (properties.hasOwnProperty(property)) {
                    this[property] = properties[property];
                }
            });
        }
    }

    /**
     * Generates and returns an accessible description of the
     * role, name,  state/property, and/or value of the specified node.
     * @param {Node} node - Node to describe in the caption.
     * @returns {String}
     */
    generateText(node) {
        const aNode = this.nodeParser.parse(node);
        const text = aNode.toString();
        return text;
    }

    /**
     * Updates the caption with the text generated
     * fromt he specified node.
     * @param {Node} node - Node whose contents should update the caption.
     * @returns {null}
     */
    update(node) {
        this.node.innerHTML = this.generateText(node);
    }

    /**
     * Generates the `<style>` HTML element for the caption CSS styles
     * @returns {Element}
     */
    getCSS() {
        var cssProperties = [];
        for (const property in this.css) {
            if (Object.hasOwnProperty.call(this.css, property)) {
                cssProperties.push(property + ': ' + this.css[property]);
            }
        }
        var css = `#${this.id} { ${cssProperties.join('; ')}; }`;
        var node = document.createElement('style');
        node.appendChild(document.createTextNode(css));
        return node;
    }

    /**
     * Generates the HTML element for the screen reader caption
     * and stores it in this object's node attribute.
     * @returns {Element}
     */
    getHTML() {
        var node = document.createElement('div');
        node.setAttribute('id', this.id);
        this.node = node;
        return node;
    }
}

module.exports = {
    Caption
};
