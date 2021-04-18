/**
 * @class
 * Class to represent and manage a browser-based screen reader simulator.
 */
"use strict";

export class ScreenReader {

    overlay;
    quickKeyManager;
    /**
     * @constructor
     * @param {Overlay} overlay - Overlay object.
     * @param {QuickKeyManager} qkm - Object to manage quick key interactions
     */
    constructor(overlay, qkm) {
        this.overlay = overlay;
        this.quickKeyManager = qkm;
    }

    /**
     * @method
     * Set up the screen reader and its components.
     */
    initialize() {
    }
}
