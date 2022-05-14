/**
 * Class to represent and manage a browser-based screen reader simulator.
 */
'use strict';

import { Overlay } from './overlay.js';
import { Caption } from './caption.js';
import { HelpContent } from './help-content.js';
import { NodeParser } from './node-parser.js';
import { Navigator } from './navigator.js';
import { ShortcutKeyManager } from './shortcut-key-manager.js';

export class ScreenReader {
    /**
     * Root node whose content is to be manipulated by the screen reader.
     * @type {Node}
     */
    rootNode = undefined;

    /**
     * @type {Navigator}
     */
    navigator = undefined;

    /**
     * @type {Overlay}
     */
    overlay = undefined;

    /**
     * @type {Caption}
     */
    caption = undefined;

    /**
     * @type {HelpContent}
     */
    helpContent = undefined;

    /**
     * @type {ShortcutKeyManager}
     */
    shortcutKeyManager;

    /**
     * Associative array of callback function names and definitions.
     * These are necessary because these event handlers need to be
     * added when the screen reader is set up and removed when it
     * is destroyed. They also avoid code duplication.
     * @type {Object}
     */
    callbacks = {
        updateCaptionText: function () {
            const caption = ScreenReader.get().caption;
            caption.update(event.target);
        },
        handleHelpContentButtonKeyboardShortcut: function (event) {
            const screenReader = ScreenReader.get();
            const nodeParser = screenReader.caption.nodeParser;
            const overlay = screenReader.overlay;
            const helpContent = screenReader.helpContent;
            if (!nodeParser.isTextInputField(document.activeElement)) {
                if (event.key === '*' && screenReader.isNavigationActive()) {
                    screenReader.overlay.buttons['Peek'].click();
                } else if (event.key === '?' && overlay.isVisible()) {
                    screenReader.overlay.buttons['Help'].click();
                } else if (event.key === 'Escape' && helpContent.isVisible()) {
                    screenReader.overlay.buttons['Help'].click();
                }
            }
        },
        handleRadioButtonKeyboardAction: function (event) {
            if (
                event.key === 'ArrowUp' ||
                event.key === 'ArrowDown' ||
                event.key === 'Spacebar' ||
                event.key === ' '
            ) {
                event.target.checked = true;
                ScreenReader.get().callbacks['updateCaptionText'](event);
            }
        },
        handleCheckboxKeyboardAction: function (event) {
            if (event.key === 'Spacebar' || event.key === ' ') {
                event.target.checked = !event.target.checked;
                ScreenReader.get().callbacks['updateCaptionText'](event);
                event.preventDefault();
            }
        }
    };

    /**
     * Retrieve a copy of the screen reader object or undefined if none is present.
     * @returns {ScreenReader}
     * @static
     */
    static get() {
        return document._screenReader;
    }

    /**
     * @param {Node} rootNode - Root node of content manipulated by this screen reader (optional).
     * Defaults to document.body.
     * @param {ShortcutKeyManager} skm - Object to manage shortcut key interactions (optional).
     * Defaults to ShortcutKeyManager with its default keyboard shortcuts.
     * @returns {ScreenReader} - screen reader object
     */
    constructor(rootNode, skm) {
        this.rootNode = rootNode ? rootNode : document.body;

        // Prepare the content for processing by the screen reader.
        //this.setApplicationRoleOnChildren();
        this.setupNavigation();

        // Set up components of the screen reader.
        this.appendOverlay();
        this.shortcutKeyManager = skm
            ? skm
            : new ShortcutKeyManager(this.rootNode);

        // Set up event listeners to facilitate screen reader keyboard controls.
        this.setupEventListeners();

        // Attach the new screen reader object to the top of the DOM for later use.
        document._screenReader = this;
    }

    /**
     * Adds `role="application"` attributes to each
     * child of the screen reader root node.
     */
    setApplicationRoleOnChildren() {
        var children = this.rootNode.children;
        for (var i = 0, l = children.length; i < l; i++) {
            children[i].setAttribute('role', 'application');
        }
    }

    /**
     * Iterates through the elements in the DOM, adding
     * tabindex attributes as needed to make them focusable
     * for screen reader navigation.
     */
    setupNavigation() {
        this.navigator = new Navigator();
        this.navigator.markNavigableNodes(this.rootNode);
    }

    /**
     * Generate and add the overlay to the DOM.
     */
    appendOverlay() {
        this.overlay = new Overlay();
        var overlayNode = this.overlay.getHTML();
        overlayNode.appendChild(this.overlay.getCSS());
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

        // Put the help contents inside the overlay.
        this.helpContent = new HelpContent();
        overlayNode.appendChild(this.helpContent.getCSS());
        overlayNode.appendChild(this.helpContent.getHTML());
    }

    /**
     * Sets up event listeners to facilitator screen
     * reader keyboard controls.
     */
    setupEventListeners() {
        // Navigate and update the caption with the arrow and tab keys.
        const rootNode = this.rootNode;
        rootNode.addEventListener('keydown', Navigator.arrowKeyHandlerFunction);
        rootNode.addEventListener('keyup', Navigator.tabHandlerFunction);

        // Enable shortcut keys.
        rootNode.addEventListener(
            'keydown',
            ShortcutKeyManager.eventHandlerFunction
        );

        // Enable "Peek" and "Help" buttons and keyboard shortcuts.
        const overlay = this.overlay;
        overlay.buttons['Peek'].addEventListener('click', overlay.peekHandler);
        overlay.buttons['Help'].addEventListener(
            'click',
            this.helpContent.helpContentHandler
        );
        // Make sure the current element stays in focus if the user
        // clicks or taps on the overlay.
        overlay.node.addEventListener('click', overlay.clickHandler);

        // Enable "Close" buttons in the help content dialog.
        this.helpContent.closeButtons.forEach((button) => {
            button.addEventListener(
                'click',
                this.helpContent.helpContentHandler
            );
        });

        rootNode.addEventListener(
            'keydown',
            this.callbacks['handleHelpContentButtonKeyboardShortcut']
        );

        // Keep the caption current as form field values change.
        rootNode.querySelectorAll('input, select, textarea').forEach((node) => {
            const aNode = this.caption.nodeParser.parse(node);
            if (aNode.role === 'textbox' || aNode.role === 'combobox') {
                node.addEventListener(
                    'input',
                    this.callbacks['updateCaptionText']
                );
            }
        });
        rootNode.querySelectorAll('input[type="radio"]').forEach((node) => {
            node.addEventListener(
                'keyup',
                this.callbacks['handleRadioButtonKeyboardAction']
            );
        });
        rootNode.querySelectorAll('input[type="checkbox"]').forEach((node) => {
            node.addEventListener(
                'keyup',
                this.callbacks['handleCheckboxKeyboardAction']
            );
        });

        // Move to the next or previous element when the user
        // swipes right or left, respectively.
        overlay.node.addEventListener('touchstart', overlay.pressStartHandler);
        overlay.node.addEventListener('touchend', overlay.pressEndHandler);

        // Activate the underlying element when the user
        // double clicks or double taps the overlay.
        overlay.node.addEventListener('dblclick', overlay.doubleClickHandler);
    }

    /**
     * Sets the specified node as the current position
     * in the document, giving it keyboard focus and
     * displaying its accessible text in the caption.
     * @param {Node} node - The node being moved to
     */
    moveTo(node) {
        if (!node) {
            return;
        }
        node.focus();
        var activeElement = document.activeElement;
        this.navigator.currentNode(activeElement);
        this.caption.update(activeElement);
    }

    /**
     * Returns a boolean value indicating whether or not
     * the screen reader navigation controls can be used
     * @returns {boolean}
     */
    isNavigationActive() {
        const isActive =
            this.overlay.isVisible() && !this.helpContent.isVisible()
                ? true
                : false;
        return isActive;
    }

    /**
     * Cleans up objects related to this screen reader
     * and removes its elements, classes, and attributes
     * from the DOM
     */
    cleanUp() {
        // Remove class names added by the screen reader.
        this.navigator.nodes.forEach((node) => {
            node.classList.remove(this.navigator.className);
        });

        // Remove tabindex attributes added by the screen reader.
        this.navigator.tabIndexNodes.forEach((node) => {
            node.removeAttribute('tabindex');
        });

        // Unbind event handlers from elemetns on the page
        // No need to remove ones from screen reader elements
        // which will themselves be deleted in modern browsers.
        // See https://stackoverflow.com/questions/12528049.
        const rootNode = this.rootNode;
        rootNode.removeEventListener(
            'keydown',
            Navigator.arrowKeyHandlerFunction
        );
        rootNode.removeEventListener('keyup', Navigator.tabHandlerFunction);
        rootNode.removeEventListener(
            'keydown',
            ShortcutKeyManager.eventHandlerFunction
        );
        rootNode.removeEventListener(
            'keydown',
            this.callbacks['handleHelpContentButtonKeyboardShortcut']
        );
        rootNode.querySelectorAll('input, select, textarea').forEach((node) => {
            node.removeEventListener(
                'input',
                this.callbacks['updateCaptionText']
            );
        });
        rootNode.querySelectorAll('input[type="radio"]').forEach((node) => {
            node.removeEventListener(
                'keyup',
                this.callbacks['handleRadioButtonKeyboardAction']
            );
        });
        rootNode.querySelectorAll('input[type="checkbox"]').forEach((node) => {
            node.removeEventListener(
                'keyup',
                this.callbacks['handleCheckboxKeyboardAction']
            );
        });

        // Removing the overlay also deletes the caption and help content elements.
        this.overlay.node.remove();
    }
}
