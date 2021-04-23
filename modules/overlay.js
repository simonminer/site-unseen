/**
 * @class
 * Class to represent the overlay to hide the webpage 
 * to be navigated by screen reader.
 */
"use strict";

export class Overlay {

    id = "overlay";

    // Overlay CSS selector values.
    css = {
        "color": "#000000",
        "opacity": "1",
        "z-index": "1",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%"
    };

    static _properties = ["id", "css"];

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
    html() {
        var cssProperties = [];
        for (const property in this.css) {
            if (Object.hasOwnProperty.call(this.css, property)) {
                cssProperties.push(property + ": " + this.css[property]);
            }
        }
        var html = `
<style>
#{this.id} {
    ${cssProperties.join(";\n    ")};
}
</style>
<div id="${this.id}"></div>
 `;     
        return html
    }
}
