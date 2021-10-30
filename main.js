"use strict";

import { ScreenReader } from './modules/screen-reader.js';
import { ShortcutKeyManager } from './modules/shortcut-key-manager.js';

// Keys/values for shortcut keys and the CSS selectors they match.
let keyData = {
    // Press h/H to move forward/backward through headings.
    'h': 'h1, h2, h3, h4, h5, h6',
    // Press k/K to move forward/backward through links.
    'k': 'a, [role="link"]',
    // Press r/R to move forward/backward through page regions and landmarks.
    'r': ' header, nav, main, footer, [role="region"], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="search"]', 
    // Press f/F to move forward/backward through form controls.
    'f': 'input, select, button, [role="form"], [role="textbox"], [role="checkbox"], [role="button"]',
    // Press b/B to move forward/backward through buttons.
    'b': 'button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"]',
    // Press l/L to move forward/backward through lists.
    'l': 'ul, ol, dl, [role="list"]'
};


let skm = new ShortcutKeyManager(document.body, keyData);
let sr = new ScreenReader(skm);
