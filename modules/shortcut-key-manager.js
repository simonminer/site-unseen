/**
 * @class
 * Class to manage shortcut keys in the current application.
 */
'use strict';

import { ShortcutKey } from './shortcut-key.js';
import { ScreenReader } from './screen-reader.js';

export class ShortcutKeyManager {
    /**
     * @member
     * Default set of keyboard character to CSS selector mapping data
     * used to set up shortcut keys.
     */
    defaultShortcutKeyData = {
        // Press h/H to move forward/backward through headings.
        h: 'h1, h2, h3, h4, h5, h6',
        // Press k/K to move forward/backward through links.
        k: 'a, [role="link"]',
        // Press r/R to move forward/backward through page regions and landmarks.
        r: ' header, nav, main, footer, [role="region"], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="search"]',
        // Press f/F to move forward/backward through form controls.
        f: 'input, textarea, select, button, [role="form"], [role="textbox"], [role="checkbox"], [role="button"]',
        // Press b/B to move forward/backward through buttons.
        b: 'button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"]',
        // Press l/L to move forward/backward through lists.
        l: 'ul, ol, dl, [role="list"]'
    };

    /*
     * @member
     * Shortcut key map whose keys are keys to press with ShortcutKey object values.
     */
    shortcutKeys = undefined;

    /**
     * @member
     * Function to call on the node returned when a shortcut key is pressed, which
     * takes both the node and event called on it as arguments.
     * Defaults to moving focus to the node.
     */
    shortcutKeyFunction = function (node, event) {
        ScreenReader.get().moveTo(node);
    };

    /**
     * @member
     * Type of wrap-around when a shortcut key is pressed on its
     * first or last instance of its list of nodes:
     * values include 'start' or 'end'.
     */
    wrappedTo = undefined;

    /**
     * static
     * @member
     * Event handler to bind to 'keydown' events to handle shortcut key presses.
     */
    static eventHandlerFunction = function (event) {
        // Don't do anything if the Command key (on a Mac is pressed).
        // This keeps common browser commands working
        // (i.e. Command + R to refresh page).
        if (event.metaKey) {
            return;
        }

        // Don't do anything if the user is on a form field
        // that accepts text inupt.
        const activeElement = document.activeElement;
        const aNode =
            ScreenReader.get().caption.nodeParser.parse(activeElement);
        if (
            aNode.role === 'textbox' ||
            aNode.role === 'combobox' ||
            activeElement.getAttribute('type') === 'password'
        ) {
            return;
        }

        var skm = ScreenReader.get().shortcutKeyManager;
        skm.wrappedTo = undefined;

        // If the lowercase shortcut key is pressed...
        // use the next matching node.
        var node = null,
            shortcutKey = null;
        if (skm.shortcutKeys.has(event.key)) {
            shortcutKey = skm.shortcutKeys.get(event.key);
            node = shortcutKey.nextNode();
        }

        // If the uppercase shortcut key is pressed,
        // use the previous matching node.
        else if (
            event.key === event.key.toUpperCase() &&
            skm.shortcutKeys.has(event.key.toLowerCase())
        ) {
            shortcutKey = skm.shortcutKeys.get(event.key.toLowerCase());
            node = shortcutKey.previousNode();
        }
        if (node) {
            skm.wrappedTo = shortcutKey.wrappedTo;
            shortcutKey.currentNode(node);
            skm.shortcutKeyFunction(node, event);
            event.preventDefault();
        }
    };

    /**
     * @constructor
     * @param {Node} rootNode - Root node to use for finding shortcut key matches.
     * @param {Object} shortcutKeyData - Set of key/value pairs mapping keyboard characters to CSS selectors (optional). Defaults to data in defaultShortcutKeyData attribute.
     * @param {Function} func - Function to be executed on the node selected by a shortcut key (optional). Defaults to moving focus to the node.
     * @returns {ShortcutKeyManager} - A new instance of the ShortcutKeyManager class.
     */
    constructor(rootNode, shortcutKeyData, func) {
        // Map shortcut key operations.
        if (!shortcutKeyData) {
            shortcutKeyData = this.defaultShortcutKeyData;
        }
        this.shortcutKeys = this.createShortcutKeyMap(
            shortcutKeyData,
            rootNode
        );

        // Attach the function to execute when a shortcut key is pressed.
        if (func) {
            this.shortcutKeyFunction = func;
        }
        this.bindShortcutKeysToFunction(this.shortcutKeyFunction);
    }

    /**
     * @method
     * Use the specified set of key/selector pairs to construct
     * a map to connect keys to ShortcutKey objects.
     * @param {Object} shortcutKeyData - Set of key/value pairs mapping keyboard characters to CSS selectors.
     * @param {Node} rootNode - Root node to use for finding elements that match shortcut keys.
     * @returns {Map} shortcutKeys - Map of keyboard characters to ShortcutKey objects.
     */
    createShortcutKeyMap(shortcutKeyData, rootNode) {
        // Create a new ShortcutKey object for each key/selector pair
        // that matches elements beneath the specified rootNode.
        var shortcutKeyMap = new Map();
        for (const key in shortcutKeyData) {
            if (Object.hasOwnProperty.call(shortcutKeyData, key)) {
                const selector = shortcutKeyData[key];
                const sk = new ShortcutKey(key, selector, rootNode);
                if (sk.nodes.length > 0) {
                    shortcutKeyMap.set(
                        key,
                        new ShortcutKey(key, selector, rootNode)
                    );
                }
            }
        }
        return shortcutKeyMap;
    }

    /**
     * Binds the specified function to the node returned
     * by the pressed shortcut key. The lowercase shortcut key yields
     * the next matching node, and the uppercase shortcut key yields
     * the previous matching node.
     *
     * The specified function must take two parameters:
     * - The node returned by the shortcut key.
     * - The event processed by the 'keydown' listener.
     * @method
     * @param {func} - The function to call on the node returned by pressing the shortcut key.
     */
    bindShortcutKeysToFunction(func) {
        // Store the function name so it can be invoked later in the event handler.
        this.shortcutKeyFunction = func;
        return true;
    }
}
