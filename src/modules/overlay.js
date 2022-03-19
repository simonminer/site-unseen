/**
 * Class to represent the overlay to hide the webpage
 * to be navigated by screen reader.
 */
'use strict';

import { ScreenReader } from './screen-reader.js';

export class Overlay {
    /**
     * ID of overly element.
     * @type {string}
     */
    static id = 'overlay';

    /**
     * Name of CSS class to hide overlay
     * @type {string}
     */
    static hiddenClassName = 'hidden';

    /**
     * Opacity of overlay
     * @type {number}
     */
    static opacity = 1;

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
#${Overlay.id} {
    background-color: #000000;
    opacity: ${Overlay.opacity};
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
     * @type {Object}
     */
    buttons = {};

    /**
     * CSS class name of button elements on the overlay
     * @type {string}
     */
    buttonClassName = 'overlay-button';

    /**
     * Number of miliseconds the "Peek" action remains active
     * @type {int}
     */
    static peekTimeout = 3000;

    /**
     * Event handler function for "Peek" button.
     * @type {Function}
     */
    peekHandler = function () {
        const overlay = ScreenReader.get().overlay;
        if (overlay.isVisible()) {
            overlay.hide(true);
            setTimeout(function () {
                const overlay = ScreenReader.get().overlay;
                overlay.show(true);
            }, Overlay.peekTimeout);
        } else {
            overlay.show(true);
        }
    };

    /**
     * Starting coordinate for mouse move or swipe.
     * @type {int}
     */
    startX = 0;

    /**
     * Ending coordinate for mouse move or swipe.
     * @type {int}
     */
    endX = 0;

    /**
     * Event handler to register the start of
     * a swipe guesture or dragging the mouse
     * @type {Function}
     */
    pressStartHandler = function (event) {
        ScreenReader.get().overlay.startX =
            event.clientX !== undefined
                ? event.clientX
                : event.changedTouches[0].screenX;
    };

    /**
     * Event handler to register and act
     * on the end of a horizontal swipe or
     * mouse drag - moving the focus to
     * the next or previous element.
     * @type {Function}
     */
    pressEndHandler = function (event) {
        const screenReader = ScreenReader.get();
        const overlay = screenReader.overlay;
        const navigator = screenReader.navigator;
        overlay.endX =
            event.clientX !== undefined
                ? event.clientX
                : event.changedTouches[0].screenX;
        var node = undefined;

        // Swipe right to next element.
        if (overlay.endX > overlay.startX) {
            console.log('swipe right');
            node = navigator.nextNode();
        }
        // Swipe left to previous element.
        else if (overlay.startX > overlay.endX) {
            console.log('swipe left');
            node = navigator.previousNode();
        }
        if (node) {
            screenReader.moveTo(node);
        }
    };

    /**
     * Event handler to press the
     * underlying element when the user
     * double clicks the overlay.
     * @type {Function}
     */
    doubleClickHandler = function (event) {
        const currentNode = ScreenReader.get().navigator.currentNode();
        if (currentNode !== undefined) {
            currentNode.click();
        }
    };

    static _properties = [
        'id',
        'hiddenClassName',
        'css',
        'buttons',
        'buttonClassName'
    ];

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
        node.setAttribute('id', Overlay.id);

        // Create overlay buttons
        ['Help', 'Peek'].forEach((name) => {
            this.buttons[name] = this.generateButton(name);
            node.appendChild(this.buttons[name]);
        });

        this.node = node;
        return node;
    }

    /**
     * Hidesthe overlay.
     * @param {boolean} fade - Flag indicating whether or not to fade out the overlay.
     */
    hide(fade) {
        if (fade) {
            var opacity = Overlay.opacity;
            var element = this.node;
            var timer = setInterval(function () {
                if (opacity <= 0.1) {
                    clearInterval(timer);
                    element.classList.add(Overlay.hiddenClassName);
                }
                element.style.opacity = opacity;
                element.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
                opacity -= 0.1;
            }, 20);
        } else {
            this.node.classList.add(Overlay.hiddenClassName);
        }
    }

    /**
     * Fades in and displays the overlay.
     * @param {boolean} fade - Flag indicating whether or not to fade in the overlay.
     */
    show(fade) {
        this.node.classList.remove(Overlay.hiddenClassName);
        if (fade) {
            var opacity = 0.1;
            var element = this.node;
            var timer = setInterval(function () {
                if (opacity >= Overlay.opacity - 0.01) {
                    clearInterval(timer);
                }
                element.style.opacity = opacity;
                element.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
                opacity += 0.1;
            }, 20);
        }
    }

    /**
     * @returns {boolean}
     * Returns a booolean value indicating
     * whether the overlay is currently hidden.
     */
    isVisible() {
        var isVisible = this.node.classList.contains(Overlay.hiddenClassName)
            ? false
            : true;
        return isVisible;
    }
}
