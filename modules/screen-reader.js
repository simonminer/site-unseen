/**
 * @class
 * Class to represent and manage a browser-based screen reader simulator.
 */
"use strict";

import { Overlay } from "./overlay.js";
import { Caption } from "./caption.js";
import { NodeParser } from "./node-parser.js";
import { Navigator } from './navigator.js';
import { ShortcutKeyManager } from './shortcut-key-manager.js';

export class ScreenReader {

    /**
     * @member
     * {Node} - Root node whose content is to be manipulated by the screen reader.
     */
    rootNode = undefined;

    /**
     * @member
     * {Navigator}
     */
    navigator = undefined;

    /**
     * @member
     * {Overlay}
     */
    overlay = undefined;

    /**
     * @member
     * {Caption}
     */
    caption = undefined;

    /**
     * @member
     * {ShortcutKeyManager}
     */
    shortcutKeyManager;

    /**
     * @method
     * @static
     * Retrieve a copy of the screen reader object or undefined if none is present.
     * @returns {ScreenReader}
     */
    static get() {
        return document._screenReader;
    }

    /**
     * @constructor
     * @param {Node} rootNode - Root node of content manipulated by this screen reader (optional). Defaults to document.body.
     * @param {ShortcutKeyManager} skm - Object to manage shortcut key interactions (optional). Defaults to ShortcutKeyManager with its default keyboard shortcuts.
     * @returns {ScreenReader} - screen reader object
     */
    constructor(rootNode, skm) {
        this.rootNode = rootNode ? rootNode : document.body;

        // Prepare the content for processing by the screen reader.
        // this.setApplicationRoleOnChildren();
        this.setupNavigation();

        // Set up components of the screen reader.
        this.appendOverlay();
        this.shortcutKeyManager = skm ? skm : new ShortcutKeyManager(this.rootNode);

        // Attach the new screen reader object to the top of the DOM for later use.
        document._screenReader = this;
    }

    /**
     * @method
     * Adds role="application" attributes to each
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
        this.navigator = new Navigator();
        this.navigator.markNavigableNodes(this.rootNode);
    }

    /**
     * @method
     * Generate and add the overlay to the DOM.
     */
    appendOverlay() {
        this.overlay = new Overlay();
        this.rootNode.appendChild(this.overlay.getCSS());
        var overlayNode = this.overlay.getHTML();
        this.rootNode.appendChild(overlayNode);

        // Put the caption inside the overlay.
        const nodeParser = new NodeParser({
            rootNode: this.rootNode
        });
        this.caption = new Caption({
            nodeParser: nodeParser
        });
        overlayNode.appendChild(this.caption.getCSS());
        overlayNode.appendChild(this.caption.getHTML());
    }

    /**
     * @method
     * Sets the specified node as the current position
     * in the document, giving it keyboard focus and
     * displaying its accessible text in the caption.
     * @param {Node} node - The node being moved to
     */
     moveTo(node) {
         node.focus();
         var activeElement = document.activeElement;
         this.navigator.currentNode(activeElement);
         this.caption.node.innerHTML = this.caption.generate(activeElement);
     }
}
