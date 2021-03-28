/**
 * Class to represent a screen reader quick key to iterate through a set of
 * tags in the DOM when a certain key is pressed.
 */

 export class QuickKey {

    // Key to press to advance to the next node.
    key = null;

    // CSS selector for DOM nodes matched by this quick key.
    selector = '';

    // List of nodes that that match this quick key.
    nodes = [];

    constructor(key, selector) {
        this.key = key;
        this.selector = selector;
    }
 }