const np = require("../lib/next-previous-element");

test('getPreviousElement is null without node', () => {
    expect(np.getPreviousElement()).toBe(null);
});
