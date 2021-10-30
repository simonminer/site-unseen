/**
 * @class
 * Class to represent and manage a browser-based screen reader simulator.
 */
"use strict";

import { Overlay } from "./overlay.js";
import { Caption } from "./caption.js";
import { Navigator } from './navigator.js';
import { ShortcutKeyManager } from './shortcut-key-manager.js';

export class ScreenReader {

    rootNode = undefined;
    navigator = new Navigator();
    overlay = new Overlay();
    caption = new Caption();
    shortcutKeyManager;

    /**
     * @constructor
     * @param {Node} rootNode - Root node of content manipulated by this screen reader (optional). Defaults to document.body.
     * @param {ShortcutKeyManager} skm - Object to manage shortcut key interactions (optional). Defaults to ShortcutKeyManager with its default keyboard shortcuts.
     * @returns {ScreenReader} - screen reader object
     */
    constructor(rootNode, skm) {
        this.rootNode = rootNode ? rootNode : document.body;

        // Prepare the content for processing by the screen reader.
        this.setApplicationRoleOnChildren();
        this.setupNavigation();

        // Set up components of the screen reader.
        this.appendOverlay();
        this.skm = skm ? skm : new ShortcutKeyManager(this.rootNode);

        // Attach the new screen reader object to the top of the DOM for later use.
        document.screenReader = this;
    }

    /**
     * @method
     * Adds role="applicatoin" attributes to each
     * child of the screen reader root node.
     */
    setApplicationRoleOnChildren() {
        var children = this.rootNode.children;
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
        this.navigator.markNavigableNodes(this.rootNode);
    }

    /**
     * @method
     * Generate and add the overlay to the DOM.
     */
    appendOverlay() {
        this.rootNode.appendChild(this.overlay.getCSS());
        this.rootNode.appendChild(this.overlay.getHTML());

        // Put the caption inside the overlay.
        var overlayElement = document.getElementById(this.overlay.id);
        overlayElement.appendChild(this.caption.getCSS());
        overlayElement.appendChild(this.caption.getHTML());
    }
}
