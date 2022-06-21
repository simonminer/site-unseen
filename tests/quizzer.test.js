const fs = require('fs');
const { parse } = require('node-html-parser');
const { htmlToElement } = require('./test-utils.js');
const ScreenReader = require('../src/modules/screen-reader.js').ScreenReader;
const Quizzer = require('../src/modules/quizzer.js').Quizzer;
const Config = require('../src/modules/config.js').Config;

const id = `${Config.cssPrefix}quizzer`;

beforeAll(() => {
    const html = fs.readFileSync('src/index.html', 'utf8');
    const rootNode = parse(html).querySelector('main');
    document.body.innerHTML = rootNode;
});

var screenReader = undefined;
var quizzer = undefined;
beforeEach(() => {
    screenReader = new ScreenReader();
    screenReader.setup();
    quizzer = new Quizzer();
});

describe('Quizzer class tests', function () {
    test('constructor creates quizzer', () => {
        expect(quizzer instanceof Quizzer).toBe(true);
        expect(Quizzer.id).toBe(id);
        // console.log(screenReader.shortcutKeyManager.shortcutKeys);
    });
});
