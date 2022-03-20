const Config = require('../src/modules/config.js').Config;

describe('Config tests', function () {
    test('Config values are set properly', () => {
        expect(Config.cssPrefix).not.toBe(undefined);
    });
});
