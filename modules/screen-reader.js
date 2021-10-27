/**
 * @class
 * Class to represent and manage a browser-based screen reader simulator.
 */
"use strict";

import { Overlay } from "./overlay.js";
import { Caption } from "./caption.js";
import { WayMaker } from './way-maker.js';

export class ScreenReader {

    wayMaker = new WayMaker();
    overlay = new Overlay();
    caption = new Caption();
    quickKeyManager;

     // Event handler to bind to "keydown" events to handle arrow key presses.
     static eventHandlerFunction = function (event) {
        // Don't do anything if the user is on a form field.
        var activeElement = document.activeElement;
        var tagName = activeElement.tagName.toLowerCase();
        if (tagName == "select"
            || tagName == "textarea"
            || (tagName == "input" && activeElement.getAttribute("type") == "text")) {
            return;
        }

        // Move to the next or previous accessible node when the right or left
        // arrow is pressed, respectively.
        var wayMaker = document.screenReader.wayMaker;
        var node = undefined;
        if (event.key === "ArrowRight") {
            node = wayMaker.nextNode();
        }
        else if (event.key === "ArrowLeft") {
            node = wayMaker.previousNode();
        }
        else if (event.key === "Tab" || (event.shiftKey && event.key === "Tab")) {
            node = wayMaker.currentNode(document.activeElement);
        }
        if (node !== undefined) {
            node.focus();
        }
    };

    /**
     * @constructor
     * @param {QuickKeyManager} qkm - Object to manage quick key interactions
     */
    constructor(qkm) {
        this.markNavigableNodes();
        this.appendOverlay();

        // Set up the event listeners for arrow keys.
        document.addEventListener( 'keydown', ScreenReader.eventHandlerFunction);
        document.screenReader = this;

        if (qkm) {
            this.quickKeyManager = qkm;
        }
    }

    /**
     * @method
     * Iterates through the elements in the DOM, adding
     * tabindex attributes as needed to make them focusable
     * for screen reader navigation.
     */
    markNavigableNodes() {
        this.wayMaker.markNavigableNodes(document.body);
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
}
