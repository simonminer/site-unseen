/**
 * Class to represent the overlay to hide the webpage
 * to be navigated by screen reader.
 */
'use strict';

import { Config } from './config.js';
import { ScreenReader } from './screen-reader.js';

export class Overlay {
    /**
     * ID of overly element.
     * @type {string}
     */
    static id = `${Config.cssPrefix}overlay`;

    /**
     * Name of CSS class to hide overlay
     * @type {string}
     */
    static hiddenClassName = `${Config.cssPrefix}hidden`;

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
    z-index: 2147483647;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.${Config.cssPrefix}overlay-button {
    color: #ffffff;
    background-color: #1c4bad;
    background-image: none;
    box-shadow: none;
    border: none;
    margin: 10px 5px;
    padding: 5px 10px;
    float: right;
    border-radius: 10px;
    font-size: 20px;
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
    buttonClassName = `${Config.cssPrefix}overlay-button`;

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
                const screenReader = ScreenReader.get();
                screenReader.overlay.show(true);
                screenReader.moveTo(screenReader.navigator.currentNode());
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
     * Time (in Epoch miliseconds) of previous user tap.
     * @type {int}
     */
    previousTapTime = 0;

    /**
     * Maximum delay (in miliseconds) between taps
     * to register a double tap.
     * @type {int}
     */
    maxDoubleTapDelay = 500;

    /**
     * Event handler to register the start of
     * a horizontal swipe guesture.
     * (Inspired by https://stackoverflow.com/a/56663695/2171535.)
     * @type {Function}
     */
    pressStartHandler = function (event) {
        ScreenReader.get().overlay.startX =
            event.clientX !== undefined
                ? event.clientX
                : event.changedTouches[0].screenX;
    };

    /**
     * Event handler to register and act on
     * the end of a horizontal swipe gesture,
     * moving the focus to the next or previous element.
     * (Inspired by https://stackoverflow.com/a/56663695/2171535.)
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

        // Double tap activates the current node.
        if (overlay.isDoubleTap() && navigator.currentNode() !== undefined) {
            navigator.currentNode().click();
        }

        // Complete swipe gesture.
        else {
            // Swipe right to next element.
            if (overlay.endX > overlay.startX) {
                node = navigator.nextNode();
            }
            // Swipe left to previous element.
            else if (overlay.startX > overlay.endX) {
                node = navigator.previousNode();
            }
            if (node) {
                screenReader.moveTo(node);
            }
        }
    };

    /**
     * Event handler keeping the current element
     * in focus when the user clicks or taps
     * the overlay.
     * @type {Function}
     */
    clickHandler = function (event) {
        const screenReader = ScreenReader.get();
        screenReader.moveTo(screenReader.navigator.currentNode());
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
        button.setAttribute(
            'id',
            `${Config.cssPrefix}${name.toLowerCase()}-button`
        );
        button.setAttribute('class', this.buttonClassName);
        button.appendChild(document.createTextNode(name));
        return button;
    }

    /**
     * Generates a `<style>` element with the CSS properties for the overlay.
     * @returns {Element}
     */
    getCSS() {
        var node = document.createElement('style');
        node.appendChild(document.createTextNode(this.css));
        return node;
    }

    /**
     * Generates the HTML element for the overlay.
     * @returns {Element}
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
     * Returns a booolean value indicating
     * whether the overlay is currently hidden.
     * @returns {boolean}
     */
    isVisible() {
        var isVisible = this.node.classList.contains(Overlay.hiddenClassName)
            ? false
            : true;
        return isVisible;
    }

    /** Returts a boolean value indicating
     * whether a double tap just occurred.
     * @returns {boolean}
     */
    isDoubleTap() {
        var isDoubleTap = false;
        // This is a second tap.
        if (this.previousTapTime) {
            // Does it qualify as a double tap?
            const now = new Date().getTime();
            const delay = now - this.previousTapTime;
            if (delay > 0) {
                if (delay <= this.maxDoubleTapDelay) {
                    isDoubleTap = true;
                }
                this.previousTapTime = 0;
            }
        }
        // This is an initial tap; log when it happened.
        else {
            this.previousTapTime = new Date().getTime();
        }
        return isDoubleTap;
    }
}
