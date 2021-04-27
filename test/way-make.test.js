const WayMaker = require("../modules/way-maker.js").WayMaker;

var wayMaker = undefined;
beforeAll(() => {
    wayMaker = new WayMaker();
});

describe("WayMaker class tests", function () {
    test('constructor creates WayMaker object', () => {
        expect(wayMaker instanceof WayMaker).toBe(true);
    });
});
