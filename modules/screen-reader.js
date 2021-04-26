/**
 * @class
 * Class to represent and manage a browser-based screen reader simulator.
 */
"use strict";

import { Overlay } from "./overlay.js";
import { Caption } from "./caption.js";

export class ScreenReader {

    overlay = new Overlay();
    caption = new Caption();
    quickKeyManager;

    /**
     * @constructor
     * @param {QuickKeyManager} qkm - Object to manage quick key interactions
     */
    constructor(qkm) {
        this.quickKeyManager = qkm;
    }

    /**
     * @method
     * Iterates through the elements in the DOM, adding
     * tabindex attributes as needed to make them focusable
     * for screen reader navigation.
     */
    makeElementsFocusable() {
    }

    /**
     * @method
     * Generate and add the overlay to the DOM.
     */
    appendOverlay() {
        document.body.appendChild(this.overlay.getCSS());
        document.body.appendChild(this.overlay.getHTML());

        // Put the caption inside the overlay.
        var overlayElement = document.getElementById(this.overlay.id);
        overlayElement.appendChild(this.caption.getCSS());
        overlayElement.appendChild(this.caption.getHTML());
    }

    /**
     * @method
     * Set up quick key mappings.
     */
    registerQuickKeys() {
    }

    /**
     * @method
     * Set up the screen reader and its components.
     */
    initialize() {
        this.appendOverlay();
    }

// Find the next element in an in-order traversal of a tree of nodes.

    /**
     * @method
     * Find the next element in an in-order traversal of a tree of nodes.
     */
    getNextElement(element) {
        if (!element) {
            return null;
        }


        // The next element is either this one's first child...
        var nextElement = null;
        if (element.firstElementChild) {
            nextElement = element.firstElementChild;
        }

        // ...or the next sibling...
        else if (element.nextElementSibling) {
            nextElement = element.nextElementSibling;
        }

        // ...or the next sibling for the first ancestor that has one.
        else {
            var current = element;
            while (true) {
                if (current.parentElement) {
                    var parentElement = current.parentElement;
                    if (parentElement.nextElementSibling) {
                        nextElement = parentElement.nextElementSibling;
                        break;
                    }
                    else {
                        current = parentElement;
                    }
                }
                else {
                    break;
                }
            }
        }

       return nextElement;
    }

    /**
     * @method
     * Find the previous element in an in-order traversal of a tree of nodes.
     */
    getPreviousElement(element) {

        if (!element) {
            return null;
        }

        // The previous element is either this one's previous sibling
        var previousElement = null;
        if (element.previousElementSibling) {
            previousElement = element.previousElementSibling;
        }

        // ...or its parent
        else {
            previousElement = element.parentElement;
        }

        return previousElement;
    }
}
