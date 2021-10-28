/**
 * @class
 * Class to represent and manage a browser-based screen reader simulator.
 */
"use strict";

import { Overlay } from "./overlay.js";
import { Caption } from "./caption.js";
import { Navigator } from './navigator.js';

export class ScreenReader {

    navigator = new Navigator();
    overlay = new Overlay();
    caption = new Caption();
    shortcutKeyManager;

    /**
     * @constructor
     * @param {ShortcutKeyManager} skm - Object to manage shortcut key interactions
     */
    constructor(skm) {
        this.setApplicationRoleOnChildren(document.body);
        this.setupNavigation();
        this.appendOverlay();
        document.screenReader = this;

        if (skm) {
            this.shortcutKeyManager = skm;
        }
    }

    /**
     * @method
     * Adds role="applicatoin" attributes to each
     * child of the specified node (or document.body
     * if none is given).
     */
    setApplicationRoleOnChildren(node) {
        if (!node) {
            node = document.body;
        }

        var children = node.children;
        for (var i = 0, l = children.length; i < l; i++) {
            children[i].setAttribute("role","application");
        }
    }

    /**
     * @method
     * Iterates through the elements in the DOM, adding
     * tabindex attributes as needed to make them focusable
     * for screen reader navigation.
     */
    setupNavigation() {
        this.navigator.markNavigableNodes(document.body);
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
