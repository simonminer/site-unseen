/**
 * @class
 * Class to manage quick keys in the current application.
 */
"use strict";

import { QuickKey } from "./quick-key";

export class QuickKeyManager {

    quickKeys = new Map();

    /**
     * @constructor
     * @param {Object} quickKeyData - Set of key/value pairs mapping keyboard characters to CSS selectors.
     * @param {Node} rootNode - Root node to use for finding quick key matches.
     * @returns {QuickKeyManager} - A new instance of the QuickKeyManager class. 
     */
    constructor(quickKeyData, rootNode) {

        // Create a new QuickKey object for each key/selector pair.
        for (const key in quickKeyData) {
            if (Object.hasOwnProperty.call(quickKeyData, key)) {
                const selector = quickKeyData[key];
                this.quickKeys.set(key, new QuickKey(key, selector, rootNode));
            }
        }
    }
}