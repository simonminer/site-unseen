/**
 * @class
 * Class to manage quick keys in the current application.
 */
"use strict";

import { QuickKey } from "./quick-key.js";

export class QuickKeyManager {

    // Quick key map whose keys are keys to press with QuickKey object values.
    quickKeys = new Map();

    // Function to call on the node returned when a quick key is pressed.
    quickKeyFunction = undefined;

    // Type of wrap-around when a quick key is pressed on its
    // first or last instance of its list of nodes:
    // values include "start" or "end".
    wrappedTo = undefined;

    // Event handler to bind to "keydown" events to handle quick key presses.
    static eventHandlerFunction = function (event) {
        // Don't do anything if the user is on a form field.
        var activeElement = document.activeElement;
        var tagName = activeElement.tagName.toLowerCase();
        if (tagName == "select"
            || tagName == "textarea"
            || (tagName == "input" && activeElement.getAttribute("type") == "text")) {
            return;
        }
        
        var qkm = document.quickKeyManager;
        qkm.wrappedTo = undefined;

        // If the lowercase quick key is pressed...
        // use the next matching node.
        var node = null;
        if (qkm.quickKeys.has(event.key)) {
            var quickKey = qkm.quickKeys.get(event.key);
            node = quickKey.nextNode();
            qkm.wrappedTo = quickKey.wrappedTo;
        }

        // If the uppercase quick key is pressed, 
        // use the previous matching node.
        else if (event.key === event.key.toUpperCase() && qkm.quickKeys.has(event.key.toLowerCase())) {
            var quickKey = qkm.quickKeys.get(event.key.toLowerCase());
            node = quickKey.previousNode();
            qkm.wrappedTo = quickKey.wrappedTo;
        }
        if (node) {
            qkm.quickKeyFunction(node, event);
        }
    };

    /**
     * @constructor
     * @param {Object} quickKeyData - Set of key/value pairs mapping keyboard characters to CSS selectors.
     * @param {Node} rootNode - Root node to use for finding quick key matches.
     * @param {Function} func - Function to be executed on the node selected by a quick key.
     * @returns {QuickKeyManager} - A new instance of the QuickKeyManager class. 
     */
    constructor(quickKeyData, rootNode, func) {
        // Create a new QuickKey object for each key/selector pair.
        for (const key in quickKeyData) {
            if (Object.hasOwnProperty.call(quickKeyData, key)) {
                const selector = quickKeyData[key];
                const qk = new QuickKey(key, selector, rootNode);
                if (qk.nodes.length > 0) {
                    this.quickKeys.set(key, new QuickKey(key, selector, rootNode));
                }
            }
        }

        // Attach the specified function to execute when a quick key is pressed.
        if (func) {
            this.bindQuickKeysToFunction(func);
        }

    }

    /**
     * Binds the specified function to the node returned
     * by the pressed quick key. The lowercase quick key yields
     * the next matching node, and the uppercase quick key yields
     * the previous matching node.
     * 
     * The specified function must take two parameters:
     * - The node returned by the quick key.
     * - The event processed by the "keydown" listener.
     * @method
     * @param {func} - The function to call on the node returned by pressing the quick key.
     */
    bindQuickKeysToFunction(func) {
        // Store the function name so it can be invoked later in the event handler.
        this.quickKeyFunction = func;

        // Store this object in a place where it can be referenced later.
        document.quickKeyManager = this;
        
        // Set up the quick key event listener.
        document.addEventListener( 'keydown', QuickKeyManager.eventHandlerFunction);

        return true;
    }
}
