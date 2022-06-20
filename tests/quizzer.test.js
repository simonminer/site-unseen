const Quizzer = require('../src/modules/quizzer.js').Quizzer;
const Config = require('../src/modules/config.js').Config;

const id = `${Config.cssPrefix}quizzer`;

var quizzer = undefined;
beforeEach(() => {
    quizzer = new Quizzer();
});

describe('Quizzer class tests', function () {
    test('constructor creates quizzer', () => {
        expect(quizzer instanceof Quizzer).toBe(true);
        expect(Quizzer.id).toBe(id);
    });
});
