/**
 * @class
 * Class to represent the overlay to hide the webpage 
 * to be navigated by screen reader.
 */
"use strict";

export class Overlay {

    // Overlay CSS selector values.
    id = "overlay";
    color = '#000000';
    opacity = 1;
    zIndex = 1;

    static _properties = ["id", "color", "opacity", "zIndex"];

    /**
     * @constructor
     * @param {Object} properties - Set of key/value pairs to override the default properties of this class.
     */
    constructor(properties) {
        if (properties !== undefined) {
            Overlay._properties.forEach(property => {
                if (properties.hasOwnProperty(property)) {
                    this[property] = properties[property];
                }
            });
        }
    }

    /**
     * @method
     * Generates and returns the HTML for the screen reader overlay.
     */
    generate() {

    }
}
