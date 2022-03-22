'use strict';
import './styles.css';
require.context('./assets/images', false, /\.(png|jpe?g|svg)$/);
var axe = require('../node_modules/axe-core/axe.min.js');
import { ScreenReader } from './modules/screen-reader.js';
new ScreenReader();
