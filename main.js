"use strict";

import { ScreenReader } from './modules/screen-reader.js';
import { ShortcutKeyManager } from './modules/shortcut-key-manager.js';

let skm = new ShortcutKeyManager(document.body);
let sr = new ScreenReader(skm);
