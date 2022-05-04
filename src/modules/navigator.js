/**
 * Class to parse the DOM for navigable elements,
 * mark them as such, and manage keyboard navigation
 * through them.
 * @extends ElementList
 */
'use strict';

import { ElementList } from './element-list.js';
import { ScreenReader } from './screen-reader.js';

export class Navigator extends ElementList {
    /**
     * CSS class assigned to elements that are navigable by the screen reader.
     * @type {string}
     */
    className = 'srn';

    /**
     * HTML tag lists are taken from https://developer.mozilla.org/en-US/docs/Web/HTML/Element.
     *
     * List of interactive HTML tags. These are
     * already in the tab order, but the also need
     * to be navigable via screen reader controls.
     * @type {string[]}
     */
    interactiveTags = [
        'a',
        'button',
        'datalist',
        'input',
        'select',
        'textarea'
    ];

    /**
     * List of non-interactive HTML tags that should be
     * navigable by the screen reader.
     * @type {string[]}
     */
    nonInteractiveTags = [
        'address',
        'area',
        'audio',
        'blockquote',
        'caption',
        'dd',
        'dl',
        'dt',
        'figcaption',
        'figure',
        'footer',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'header',
        'img',
        'label',
        'legend',
        'li',
        'main',
        'map',
        'math',
        'nav',
        'ol',
        'p',
        'pre',
        'progress',
        'svg',
        'table',
        'td',
        'th',
        'tr',
        'track',
        'ul',
        'video'
    ];

    /**
     * List of HTML tags that could potentially
     * be navigable by the screen reader,
     * depending on their contents.
     * @type {string[]}
     */
    potentiallyNavigableTags = ['div', 'span'];

    /**
     * Number of nodes that have been assigned
     * tabindex attributes by this object.
     * @type {number}
     */
    tabIndexNodeCount = 0;

    /**
     * List of nodes that can be navigated
     * by the screen reader
     * @type {Node[]}
     */
    nodes = [];

    /**
     * Index of current node in list of navigable odes.
     * @type {number}
     */
    currentNodeIndex = -1;

    /**
     * Function to handle right and left arrow key presses.
     * @type {function}
     * @static
     */
    static arrowKeyHandlerFunction = function (event) {
        // Don't do anything if screen reader navigation is inactive.
        const screenReader = ScreenReader.get();
        if (!screenReader.isNavigationActive()) {
            return;
        }

        // Move to the previous or next accessible node when the left or right
        // arrow is pressed, respectively.
        const navigator = screenReader.navigator;
        var node = undefined;
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            node = navigator.nextNode();
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            node = navigator.previousNode();
        }

        if (node !== undefined) {
            screenReader.moveTo(node);
        }
    };

    /**
     * Function to handle Tab key presses.
     * @type {function}
     * @static
     */
    static tabHandlerFunction = function (event) {
        // Don't do anything if screen reader navigation is inactive.
        const screenReader = ScreenReader.get();
        if (!screenReader.isNavigationActive()) {
            return;
        }

        if (event.key === 'Tab' || (event.shiftKey && event.key === 'Tab')) {
            screenReader.moveTo(document.activeElement);
        }
    };

    /**
     * Type of wrap-around when the screen reader reaches the
     * first or last navigable node:
     * values include 'start' or 'end'.
     * @type {boolean}
     */
    wrappedTo = undefined;

    static _properties = [
        'className',
        'tabIndexNodeCount',
        'nodes',
        'wrappedTo'
    ];

    /**
     * @param {Object} properties - Set of key/value pairs to override the default properties of this class.
     */
    constructor(properties) {
        super();
        if (properties !== undefined) {
            Navigator._properties.forEach((property) => {
                if (properties.hasOwnProperty(property)) {
                    this[property] = properties[property];
                }
            });
        }
    }

    /**
     * @param {Node} node - The HTML element being for considered for a tabindex attribute.
     * @returns {boolean}
     * Tests whether or not the given HTML node needs a tabindex="-1" attribute
     * attribute so that it can receive keyboard focus
     */
    isTabIndexNeeded(node) {
        const tagName = node.tagName.toLowerCase();
        var isNeeded = false;

        // Is the node non-interactive?
        if (this.nonInteractiveTags.includes(tagName)) {
            isNeeded = true;
        } else if (this.potentiallyNavigableTags.includes(tagName)) {
            // Does the node have a role?
            if (node.hasAttribute('role')) {
                isNeeded = true;
            } else {
                // Does the node have at least one child that contains text?
                const children = node.childNodes;
                for (let i = 0; i < children.length; i++) {
                    if (
                        children[i].nodeType === 3 &&
                        children[i].nodeValue.trim() !== ''
                    ) {
                        isNeeded = true;
                        break;
                    }
                }
            }
        }

        return isNeeded;
    }

    /**
     * @param {Node} node - The HTML element to be processed.
     * Examines the specified HTML node, flagging it appropriately
     * if it can be navigated by a screen reader.
     */
    processNode(node) {
        // If the screen reader should be able to navigate
        // this node, make sure it has a tabindex attribute.
        const isTabIndexNeeded = this.isTabIndexNeeded(node);
        if (isTabIndexNeeded) {
            node.setAttribute('tabindex', '-1');
            this.tabIndexNodeCount += 1;
        }

        // Assign a special class to the node if can be navigated
        // by the screen reader.
        const tagName = node.tagName.toLowerCase();
        if (isTabIndexNeeded || this.interactiveTags.indexOf(tagName) >= 0) {
            node.classList.add(this.className);
            this.nodes.push(node);
        }
    }

    /**
     * @param {Node} rootNode - Top-level node from which to find and process elements
     * Parses the DOM starting from the specified root node,
     * finding and flagging nodes that are navigable by the screen reader.
     */
    markNavigableNodes(rootNode) {
        rootNode.querySelectorAll('*').forEach((node) => {
            this.processNode(node);
        });
    }
}
