'use strict';

// Import assets and required JavaScript libraries.
require.context('./assets/images', false, /\.(png|jpe?g|svg)$/);
var axe = require('../node_modules/axe-core/axe.min.js');
import { ScreenReader } from './modules/screen-reader.js';
new ScreenReader();
