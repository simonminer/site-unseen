const AccessibleNode = require('../modules/accessible-node.js').AccessibleNode;
const { htmlToElement } = require('./test-utils.js');

describe('AccessibleNode class tests', function () {
    test('constructor creates accessible node', () => {
        var linkName = 'test-link';
        var node = htmlToElement(
            `<a name="${linkName}">This is a link</a>`,
            'a'
        );
        var aNode = new AccessibleNode(node);
        expect(aNode instanceof AccessibleNode).toBe(true);
        expect(aNode.actualNode).toBe(node);
        expect(aNode.tagName).toBe(node.tagName.toLowerCase());
        expect(aNode.name).toBe(linkName);
        expect(aNode.separator).toBe(': ');
    });

    test('toString returns correct value', () => {
        var name = 'test-link';
        var node = htmlToElement(`<a name="${name}">This is a link</a>`, 'a');
        var aNode = new AccessibleNode(node);
        expect(aNode.toString()).toBe(`${name}`);

        var role = 'link';
        aNode.role = role;
        var sep = aNode.separator;
        expect(aNode.toString()).toBe(`${role}${sep}${name}`);

        var value = 'test value';
        aNode.value = value;
        expect(aNode.toString()).toBe(`${role}${sep}${name}${sep}${value}`);

        var metadata = 'test metadata';
        aNode.metadata = metadata;
        expect(aNode.toString()).toBe(
            `${role} ${metadata}${sep}${name}${sep}${value}`
        );
    });
});
