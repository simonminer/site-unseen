/**
 * Class to render the Help display.
 */
'use strict';

import { Overlay } from './overlay.js';
import { ScreenReader } from './screen-reader.js';

export class HelpContent {
    /**
     * ID of help content element.
     * @type {string}
     */
    static id = 'help';

    static closeButtonId = 'help-close-button';
    /**
     * Help content node in DOM.
     * @type {Node}
     */
    node = undefined;

    /**
     * HelpContent CSS rules.
     * @type {string}
     */
    css = `
#${HelpContent.id} {
    max-width: 950px;
    margin: auto;
    box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%);
    height: 450px;
    font-family: sans-serif;
    background-color: #fff;
    color: #1c4bad;
    border-radius: 10px;
    position: relative;
    top: 20%;
    z-index: 100;
    padding: 5px;
}
#help-heading {
    text-align: center;
}
#${HelpContent.closeButtonId} {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #1c4bad;
    color: #ffffff;
    font-size: 24px;
    border-radius: 3px;
    padding: 2px 8px;
}
#help-content {
    padding: 0 20px;
}
.shortcut-keys {
    text-align: right;
    padding-right: 20px;
    padding-bottom: 10px;
}
.shortcut-keys kbd {
    background-color: #fff;
    color: #000;
    padding: 3px 5px;
    border-radius: 3px;
    border: 1px solid #333333;
    font-weight: bold;
}
.shortcut-keys, .shortcut-description {
    border: none;
}
.shortcut-description {
    padding-right: 15px;
}
`;

    /**
     * HTML for the HelpContent display.
     * @type {string}
     */
    html = `
<div id="${HelpContent.id}" class="${Overlay.hiddenClassName}">
    <div id="help-heading">
        <h2>Site Unseen Keyboard Commands</h2>
        <button id="${HelpContent.closeButtonId}">x</button>
    </div>
    <div id="help-content">
        <table>
            <tbody>
                <tr>
                    <td class="shortcut-keys">
                        <kbd>&larr;</kbd> / <kbd>&rarr;</kbd>
                    </td>
                    <td class="shortcut-Description">
                        Next/previous element
                    </td>
                    <td class="shortcut-keys">
                        <kbd>h</kbd> / <kbd>H</kbd>
                    </td>
                    <td class="shortcut-Description">
                        Next/previous heading
                    </td>
                </tr>
                <tr>
                    <td class="shortcut-keys">
                        <kbd>Tab</kbd> / <kbd>Shif+Tab</kbd>
                    </td>
                    <td class="shortcut-Description">
                        Next/previous interactive element
                    </td>
                    <td class="shortcut-keys">
                        <kbd>k</kbd> / <kbd>K</kbd>
                    </td>
                    <td class="shortcut-Description">
                        Next/previous link
                    </td>
                </tr>
                <tr>
                    <td class="shortcut-keys"><kbd>Enter</kbd></td>
                    <td class="shortcut-description">
                        Press button/follow link/select current option
                    </td>
                    <td class="shortcut-keys">
                        <kbd>l</kbd> / <kbd>L</kbd>
                    </td>
                    <td class="shortcut-description">
                        Next/previous list
                    </td>
                </tr>
                <tr>
                    <td class="shortcut-keys">
                        <kbd>&uarr;</kbd> / <kbd>&darr;</kbd>
                    </td>
                    <td class="shortcut-Description">
                        Next/previous radio button/checkbos/menu item
                    </td>
                    <td class="shortcut-keys">
                        <kbd>f</kbd> / <kbd>F</kbd>
                    </td>
                    <td class="shortcut-description">
                        Next/previous form input field
                    </td>
                </tr>
                <tr>
                    <td class="shortcut-keys">
                        <kbd>Space</kbd>
                    </td>
                    <td class="shortcut-Description">
                        Select current radio button/checkbox/menu item
                    </td>
                    <td class="shortcut-keys">
                        <kbd>b</kbd> / <kbd>B</kbd>
                    </td>
                    <td class="shortcut-description">
                        Next/previous button
                    </td>
                </tr>
                <tr>
                    <td class="shortcut-keys">
                        <kbd>*</kbd>
                    </td>
                    <td class="shortcut-Description">
                        Display web page content for a few seconds
                    </td>
                    <td class="shortcut-keys">
                        <kbd>r</kbd> / <kbd>R</kbd>
                    </td>
                    <td class="shortcut-Description">
                        Next/previous landmark region
                    </td>
                </tr>
                <tr>
                    <td class="shortcut-keys">
                        <kbd>?</kbd>
                    </td>
                    <td class="shortcut-Description">
                        Display/hide this help documentation
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
`;

    /**
     * Top-level HTML element of the help content display.
     * @type {Node}
     */
    node = undefined;

    /**
     * Button element to close help content display.
     * @type {Node}
     */
    closeButton = undefined;

    /**
     * Event handler function for viewing the help content
     * @type {Function}
     */
    helpContentHandler = function () {
        const screenReader = ScreenReader.get();
        const helpContent = screenReader.helpContent;
        const overlayButtons = screenReader.overlay.buttons;
        if (helpContent.isVisible()) {
            helpContent.hide(overlayButtons);
        } else {
            helpContent.show(overlayButtons);
        }
    };

    static _properties = ['id', 'node', 'html', 'node', 'closeButtonId'];

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
     * Generates a `<style>` element with the CSS rules for the help content.
     */
    getCSS() {
        var node = document.createElement('style');
        node.appendChild(document.createTextNode(this.css));
        return node;
    }

    /**
     * @returns {Element}
     * Generates the HTML element for the help content.
     */
    getHTML() {
        const placeholder = document.createElement('div');
        placeholder.innerHTML = this.html;
        this.node = placeholder.firstElementChild;

        // Find the close button.
        this.closeButton = this.node.querySelector(
            '#' + HelpContent.closeButtonId
        );

        return this.node;
    }

    /**
     * Hides the help content.
     * @param {Object} overlayButtons - map of button name/elemens to display when
     * the help content is hidden.
     */
    hide(overlayButtons) {
        this.node.classList.add(Overlay.hiddenClassName);
        ['Peek', 'Help'].forEach((buttonName) => {
            overlayButtons[buttonName].classList.remove(
                Overlay.hiddenClassName
            );
        });
    }

    /**
     * Displays the help content.
     * @param {Object} overlayButtons - map of button name/elemens to hide when
     * the help content is visible.
     */
    show(overlayButtons) {
        this.node.classList.remove(Overlay.hiddenClassName);
        ['Peek', 'Help'].forEach((buttonName) => {
            overlayButtons[buttonName].classList.add(Overlay.hiddenClassName);
        });
    }

    /**
     * @returns {boolean}
     * Returns a booolean value indicating
     * whether the help content is currently visible.
     */
    isVisible() {
        var isVisible = this.node.classList.contains(Overlay.hiddenClassName)
            ? false
            : true;
        return isVisible;
    }
}
