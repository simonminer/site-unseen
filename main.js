"use strict";

import { QuickKeyManager } from './modules/quick-key-manager.js';

let keyData = {
    'h': 'h1, h2, h3',
    'l': 'a',
    'z': 'foo'
};

// TODO: Replace this function with one that suits your purpose.
function alertQuickKey(node, e) {
    alert(e.key + " ==> " + node.nodeText + ":" + node.textContent);
}
let qkm = new QuickKeyManager(keyData, document.body);

// Check if the pressed key is a quick key.
document.addEventListener( 'keydown', function (e) {
    // If the pressed key is the lowercase version of a quick key,
    // target the next matching node.
    var node = null;
    if (qkm.quickKeys.has(e.key)) {
        node = qkm.quickKeys.get(e.key).nextNode();
    }
    // If the pressed key is the uppercase version of a quick key,
    // target the next matching node.
    else if (e.key === e.key.toUpperCase() && qkm.quickKeys.has(e.key.toLowerCase())) {
        node = qkm.quickKeys.get(e.key.toLowerCase()).previousNode();
    }
    // Move keyboard focus to the matching node (if any).
    if (node) {
        // alert( e.key + " ==> " + node.nodeName + ": " + node.textContent );
        node.focus();
    }
});