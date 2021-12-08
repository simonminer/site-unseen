/**
 * Class to represent the overlay to hide the webpage
 * to be navigated by screen reader.
 */
'use strict';

class Overlay {
    /**
     * ID of overly element.
     * @type {string}
     */
    id = 'overlay';

    /**
     * Overlay node in DOM.
     * @type {Node}
     */
    node = undefined;

    /**
     * Overlay CSS selector values.
     * @type {string}
     */
    css = {
        'background-color': '#000000',
        opacity: '0.75',
        'z-index': '1',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        position: 'fixed'
    };

    static _properties = ['id', 'css'];

    /**
     * @param {Object} properties - Set of key/value pairs to override the default properties of this class.
     */
    constructor(properties) {
        if (properties !== undefined) {
            Overlay._properties.forEach((property) => {
                if (properties.hasOwnProperty(property)) {
                    this[property] = properties[property];
                }
            });
        }
    }

    /**
     * @returns {Element}
     * Generates a `<style>` element with the CSS properties for the overlay.
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
     * @returns {Element}
     * Generates the HTML element for the overlay.
     */
    getHTML() {
        var node = document.createElement('div');
        node.setAttribute('id', this.id);
        this.node = node;
        return node;
    }
}

module.exports = {
    Overlay
}
