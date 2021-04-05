import { QuickKeyManager } from './modules/quick-key-manager.js';

const keyData = {
    'h': 'h1, h2, h3',
    'l': 'a',
    'z': 'foo'
};

let qkm = new QuickKeyManager(keyData, document.body);