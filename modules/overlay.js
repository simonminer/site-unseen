/**
 * Class to represent the overlay to hide the webpage
 * to be navigated by screen reader.
 */
'use strict';

export class Overlay {
    /**
     * ID of overly element.
     * @type {string}
     */
    id = 'overlay';

    /**
     * Name of CSS class to hide overlay
     * @type {string}
     */
    static hiddenClassName = 'hidden';

    /**
     * Overlay node in DOM.
     * @type {Node}
     */
    node = undefined;

    /**
     * Overlay CSS selector values.
     * @type {string}
     */
    css = `
#overlay {
    background-color: #000000;
    opacity: 0.75;
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.overlay-button {
    color: #ffffff;
    background-color: #1c4bad;
    margin: 10px 5px;
    padding: 5px 10px;
    float: right;
    border-radius: 10px;
    font-size: 15pt;
}
.${Overlay.hiddenClassName} {
    display: none;
}
    `;

    /**
     * Map of overlay button names to their corresponding elements.
     * @type{Map}
     */
    buttons = {};

    /**
     * CSS class name of button elements on the overlay
     * @type {string}
     */
    buttonClassName = 'overlay-button';

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
     * Generates the HTML for a <button> element using the specified name.
     * Note that the button gets assigned an "id" attribute of "{name}-button" (lower-cased)
     * and a "class" attributge of "overlay-button".
     * @param {string} name - Name of the button element used for its "id" attribute and text.
     * @returns {Element}
     */
    generateButton(name) {
        var button = document.createElement('button');
        button.setAttribute('id', `${name.toLowerCase()}-button`);
        button.setAttribute('class', this.buttonClassName);
        button.appendChild(document.createTextNode(name));
        return button;
    }

    /**
     * @returns {Element}
     * Generates a `<style>` element with the CSS properties for the overlay.
     */
    getCSS() {
        var node = document.createElement('style');
        node.appendChild(document.createTextNode(this.css));
        return node;
    }

    /**
     * @returns {Element}
     * Generates the HTML element for the overlay.
     */
    getHTML() {
        var node = document.createElement('div');
        node.setAttribute('id', this.id);

        // Create overlay buttons
        ['Help', 'Settings', 'Peak'].forEach((name) => {
            this.buttons[name] = this.generateButton(name);
            node.appendChild(this.buttons[name]);
        });

        this.node = node;
        return node;
    }

    /**
     * Hides the overlay.
     */
    hide() {
        this.node.classList.add(Overlay.hiddenClassName);
    }

    /**
     * Displays the overlay.
     */
    show() {
        this.node.classList.remove(Overlay.hiddenClassName);
    }

    /**
     * @returns {boolean}
     * Returns a booolean value indicating
     * whether the overlay is currently hidden.
     */
    isHidden() {
        var isHidden = this.node.classList.contains(Overlay.hiddenClassName)
            ? true
            : false;
        return isHidden;
    }
}
