const Caption = require("../modules/caption.js").Caption;

const id = "caption";
const textColor = '#000000';
const backgroundColor = '#ffffff';
const borderColor = '#00000';
const borderWidth = "3 px";

var caption = undefined;
beforeAll(() => {
    caption = new Caption({
        textColor: textColor,
        backgroundColor: backgroundColor,
        borderColor: borderColor
    });
});

describe("Caption class tests", function () {
    test('constructor creates caption', () => {
        expect(caption instanceof Caption).toBe(true);
        expect(caption.id).toBe(id);
        expect(caption.textColor).toBe(textColor);
        expect(caption.backgroundColor).toBe(backgroundColor);
        expect(caption.borderColor).toBe(borderColor);
        expect(caption.borderWidth).toBe(borderWidth);
    });
});