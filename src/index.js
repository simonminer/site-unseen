'use strict';
import './styles.css';
require.context( './assets/images', false, /\.(png|jpe?g|svg)$/ );

import { ScreenReader } from './modules/screen-reader.js';
new ScreenReader();
