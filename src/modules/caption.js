/**
 * Class to represent the screen reader caption which displays
 * the role, state/property, and value of an HTML element.
 */
'use strict';

import { Config } from './config.js';
import { Overlay } from './overlay.js';
import { NodeParser } from './node-parser.js';

export class Caption {
    /**
     * ID of caption element in DOM.
     * @type {string}
     */
    static id = `${Config.cssPrefix}caption`;

    /**
     * Caption node in DOM.
     * @type {Node}
     */
    node = undefined;

    /**
     * Caption CSS selector name/value pairs.
     * @type {string}
     */
    css = `
#${Caption.id} {
    color: #ffffff;
    background: #000000;
    border: 3px solid #ffffff;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: bold;
    padding: 0.5rem;
    width: 50%;
    height: 30%;
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
    text-align: left;
}
@media only screen and (max-width: 825px) {
    #${Caption.id} {
        width: 91%;
        height: 55%;
        font-size: 1rem;
    }
}
`;

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
        var text = aNode.toString();
        // Ensure the text does not include HTML tags.
        if (text) {
            text = text.replace(/<.+?>/gs, '');
        }
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
     * Sets the initial text of this caption object
     * to the title or URL of the page, whichever
     * is available.
     * @returns {String}
     */
    setInitialText() {
        this.node.innerHTML =
            document.title !== '' ? document.title : window.location.href;
    }

    /**
     * Generates the `<style>` HTML element for the caption CSS styles
     * @returns {Element}
     */
    getCSS() {
        var node = document.createElement('style');
        node.appendChild(document.createTextNode(this.css));
        return node;
    }

    /**
     * Generates the HTML element for the screen reader caption
     * and stores it in this object's node attribute.
     * @returns {Element}
     */
    getHTML() {
        var node = document.createElement('div');
        node.setAttribute('id', Caption.id);
        this.node = node;
        return node;
    }

    /**
     * Hide the screen reader caption.
     */
    hide() {
        this.node.classList.add(Overlay.hiddenClassName);
    }

    /**
     * Display the screen reader caption.
     */
    show() {
        this.node.classList.remove(Overlay.hiddenClassName);
    }

    /**
     * @returns {boolean}
     * Returns a booolean value indicating
     * whether the caption is currently hidden.
     */
    isVisible() {
        var isVisible = this.node.classList.contains(Overlay.hiddenClassName)
            ? false
            : true;
        return isVisible;
    }
}
