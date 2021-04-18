/**
 * @class
 * Class to represent the overlay to hide the webpage 
 * to be navigated by screen reader.
 */
"use strict";

export class Overlay {

    // Overlay CSS selector values.
    color = '#000000';
    opacity = 1;
    zIndex = 1;

    /**
     * @constructor
     * @param {String} color - Color of overlay.
     * @param {float} opacity - Opacity of overlay: must be between 0 and 1.   
     * @param int zIndex - z-index for overlay: must be an integer.
     */
    constructor(color, opacity, zIndex) {
        // TODO Add input validation.
        this.color = color;
        this.opacity = opacity;
        this.zIndex = zIndex;
    }

    /**
     * Generates and returns the HTML for the screen reader overlay.
     */
    generate() {

    }
}