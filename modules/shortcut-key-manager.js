/**
 * @class
 * Class to manage shortcut keys in the current application.
 */
"use strict";

import { ShortcutKey } from "./shortcut-key.js";

export class ShortcutKeyManager {

    // Shortcut key map whose keys are keys to press with ShortcutKey object values.
    shortcutKeys = new Map();

    // Function to call on the node returned when a shortcut key is pressed, which
    // takes both the node and event called on it as arguments.
    // Defaults to moving focus to the node.
    shortcutKeyFunction = function (node, event) {
        node.focus();
        if (document.shortcutKeyManager.wrappedTo !== undefined) {
            alert( `Wrapped to ${document.shortcutKeyManager.wrappedTo} of node list.`);
        }
    };

    // Type of wrap-around when a shortcut key is pressed on its
    // first or last instance of its list of nodes:
    // values include "start" or "end".
    wrappedTo = undefined;

    // Event handler to bind to "keydown" events to handle shortcut key presses.
    static eventHandlerFunction = function (event) {
        // Don't do anything if the user is on a form field.
        var activeElement = document.activeElement;
        var tagName = activeElement.tagName.toLowerCase();
        if (tagName == "select"
            || tagName == "textarea"
            || (tagName == "input" && activeElement.getAttribute("type") == "text")) {
            return;
        }
        
        var skm = document.shortcutKeyManager;
        skm.wrappedTo = undefined;

        // If the lowercase shortcut key is pressed...
        // use the next matching node.
        var node = null;
        if (skm.shortcutKeys.has(event.key)) {
            var shortcutKey = skm.shortcutKeys.get(event.key);
            node = shortcutKey.nextNode();
            skm.wrappedTo = shortcutKey.wrappedTo;
        }

        // If the uppercase shortcut key is pressed, 
        // use the previous matching node.
        else if (event.key === event.key.toUpperCase() && skm.shortcutKeys.has(event.key.toLowerCase())) {
            var shortcutKey = skm.shortcutKeys.get(event.key.toLowerCase());
            node = shortcutKey.previousNode();
            skm.wrappedTo = shortcutKey.wrappedTo;
        }
        if (node) {
            skm.shortcutKeyFunction(node, event);
        }
    };

    /**
     * @constructor
     * @param {Node} rootNode - Root node to use for finding shortcut key matches.
     * @param {Object} shortcutKeyData - Set of key/value pairs mapping keyboard characters to CSS selectors.
     * @param {Function} func - Function to be executed on the node selected by a shortcut key (optional). Defaults to moving focus to the node.
     * @returns {ShortcutKeyManager} - A new instance of the ShortcutKeyManager class. 
     */
    constructor(rootNode, shortcutKeyData, func) {
        // Create a new ShortcutKey object for each key/selector pair
        // that matches elements beneath the specified rootNode.
        for (const key in shortcutKeyData) {
            if (Object.hasOwnProperty.call(shortcutKeyData, key)) {
                const selector = shortcutKeyData[key];
                const sk = new ShortcutKey(key, selector, rootNode);
                if (sk.nodes.length > 0) {
                    this.shortcutKeys.set(key, new ShortcutKey(key, selector, rootNode));
                }
            }
        }

        // Attach the function to execute when a shortcut key is pressed.
        if (func) {
            this.shortcutKeyFunction = func;
        }
        this.bindShortcutKeysToFunction(this.shortcutKeyFunction);
    }

    /**
     * Binds the specified function to the node returned
     * by the pressed shortcut key. The lowercase shortcut key yields
     * the next matching node, and the uppercase shortcut key yields
     * the previous matching node.
     * 
     * The specified function must take two parameters:
     * - The node returned by the shortcut key.
     * - The event processed by the "keydown" listener.
     * @method
     * @param {func} - The function to call on the node returned by pressing the shortcut key.
     */
    bindShortcutKeysToFunction(func) {
        // Store the function name so it can be invoked later in the event handler.
        this.shortcutKeyFunction = func;

        // Store this object in a place where it can be referenced later.
        document.shortcutKeyManager = this;
        
        // Set up the shortcut key event listener.
        document.addEventListener( 'keydown', ShortcutKeyManager.eventHandlerFunction);

        return true;
    }
}
