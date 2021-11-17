const NodeParser = require("../modules/node-parser.js").NodeParser;
const { htmlToElement } = require('./test-utils.js');

var nodeParser = undefined;
beforeAll(() => {
    nodeParser = new NodeParser();
})

describe("NodeParser class tests", function () {
    test('constructor creates nodeParser', () => {
        expect(nodeParser instanceof NodeParser).toBe(true);
        expect(Object.keys(nodeParser.tagsWithoutRole).length).toBeGreaterThan(0);
        expect(nodeParser.rootNode).toBe(document.body);
        expect(nodeParser.virtualTree instanceof Array).toBe(true);
        expect(nodeParser.virtualTree.length).toBe(1);
        expect(nodeParser.virtualTree[0].actualNode.tagName).toBe("BODY");
    });

    test('generateTree creates a list of nodes', () => {
        document.body.innerHTML = '<h1>Heading</h1><p>Text<p><ul><li>One</li><li>Two</li></ul>';
        const tree = nodeParser.generateTree(document.body);
        expect(tree instanceof Array).toBe(true);
        expect(tree.length).toBe(1);
        expect(tree[0].actualNode.tagName).toBe("BODY");
        expect(tree[0].actualNode.children.length).toBeGreaterThanOrEqual(3);
    });

    // Common HTML tags.
    test('nodeParser parses heading tags', () => {
        for (var i = 1; i <= 6; i++) {
            var tagName = `h${i}`;
            var node =htmlToElement(`<${tagName}>Heading level ${i}</${tagName}>`, tagName);
            nodeParser = new NodeParser({
                rootNode: node
            });
            expect(nodeParser.parseHeadingLevel(node)).toBe(i.toString());
            var data = nodeParser.parse(node);
            expect(data.role).toBe(`heading level ${i}`);
            expect(data.name).toBe(undefined);
            expect(data.value).toBe(`Heading level ${i}`);

            node = htmlToElement(`<div role="heading" aria-level="${i}">Heading level ${i}</div>`, 'div');
            nodeParser = new NodeParser({
                rootNode: node
            });
            expect(nodeParser.parseHeadingLevel(node)).toBe(i.toString());
            data = nodeParser.parse(node);
            expect(data.role).toBe(`heading level ${i}`);
            expect(data.name).toBe(undefined);
            expect(data.value).toBe(`Heading level ${i}`);
        }
        
        var node = htmlToElement('<p>Not a heading</p>', 'p');
        nodeParser = new NodeParser({
            rootNode: node
        });
        expect(nodeParser.parseHeadingLevel(node)).toBe(undefined);
    });
    test('nodeParser parses paragraph tags', () => {
        var text = "This is a paragraph";
        var node =htmlToElement(`<p>${text}</p>`, 'p');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var data = nodeParser.parse(node);
        expect(data.role).toBe(null);
        expect(data.name).toBe(undefined);
        expect(data.value).toBe(text);
    });
    test('nodeParser parses link tags', () => {
        var linkText = "This is a link";
        var name = "link";
        var node = htmlToElement(`<a href="#" name="${name}">${linkText}</a>`, 'a');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var data = nodeParser.parse(node);
        expect(data.role).toBe('link');
        expect(data.name).toBe(name);
        expect(data.value).toBe(linkText);

        node = htmlToElement(`<div role="link" href="#">${linkText}</div>`, 'div');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var data = nodeParser.parse(node);
        expect(data.role).toBe('link');
        expect(data.name).toBe(undefined);
        expect(data.value).toBe(linkText);
    });
    test('nodeParser parses list tags', () => {
        ['ol', 'ul'].forEach(function(tagName) {
            var listItemText = "Item 1";
            var node = htmlToElement(`<${tagName}><li>${listItemText}</li></${tagName}>`, tagName);
            nodeParser = new NodeParser({
                rootNode: node
            });
            var listItemCount = node.getElementsByTagName('li').length;
            expect(nodeParser.countListItems(node)).toBe(listItemCount);
            var data = nodeParser.parse(node);
            expect(data.role).toBe(`list (${listItemCount} item)`);
            expect(data.name).toBe(undefined);
            expect(data.value).toBe('');

            node = htmlToElement(`<${tagName}><li>${listItemText}</li></${tagName}>`, 'li');
            nodeParser = new NodeParser({
                rootNode: node
            });
            data = nodeParser.parse(node);
            expect(data.role).toBe("list item");
            expect(data.name).toBe(undefined);
            expect(data.value).toBe(listItemText);
        });
        var node =htmlToElement('<p>Not a list</p>', 'p');
        nodeParser = new NodeParser({
            rootNode: node
        });
        expect(nodeParser.countListItems(node)).toBe(undefined);

        // TODO Add tests for ARIA list and listitem roles.
    });
    test('nodeParser parses definition list tags', () => {
        var html = "<dl><dt>Term</dt><dd>Definition</dd></dl>";
        var node = htmlToElement(html, 'dl');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var data = nodeParser.parse(node);
        expect(data.role).toBe("list");
        expect(data.name).toBe(undefined);
        expect(data.value).toBe('TermDefinition');

        node = htmlToElement(html, 'dt');
        nodeParser = new NodeParser({
            rootNode: node
        });
        data = nodeParser.parse(node);
        expect(data.role).toBe("list item");
        expect(data.name).toBe(undefined);
        expect(data.value).toBe("Term");

        node = htmlToElement(html, 'dd');
        data = nodeParser.parse(node);
        expect(data.role).toBe("list item");
        expect(data.name).toBe(undefined);
        expect(data.value).toBe("Definition");
    });
    test('nodeParser parses image tags', () => {
        var altText = "Sample image";
        var src = "image.png";
        var node = htmlToElement(`<img src="${src}" alt="${altText}" />`, 'img');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var data = nodeParser.parse(node);
        expect(data.role).toBe("img");
        expect(data.name).toBe(undefined);
        expect(data.value).toBe(altText);

        node = htmlToElement(`<div role="img" aria-label="${altText}">Test</div>`, 'div');
        nodeParser = new NodeParser({
            rootNode: node
        });
        data = nodeParser.parse(node);
        expect(data.role).toBe("img");
        expect(data.name).toBe(undefined);
        expect(data.value).toBe(altText);

        // TODO Test SVG tag.
    });

    // Form fields.
    test('nodeParser parses input tags', () => {
        ['checkbox', 'radio', 'reset', 'submit', 'text'].forEach(function(type) {
            var role = type === "reset" || type === "submit"
                ? "button" : type === "text"
                ? "textbox" : type;
            var name = `test-${type}`;
            var value = `Test ${type}`;
            var node = htmlToElement(`<input type="${type}" aria-label="${value}" name="${name}" />`, 'input');
            nodeParser = new NodeParser({
                rootNode: node
            });
            var data = nodeParser.parse(node);
            expect(data.role).toBe(role);
            expect(data.name).toBe(name);
            expect(data.value).toBe(value);
        });
    });
    test('nodeParser parses textarea tag', () => {
        var name = 'test-textarea';
        var value = 'Test Textarea';
        var node = htmlToElement(`<textarea name="${name}" aria-label="${value}">${value} Value</button>`, 'textarea');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var data = nodeParser.parse(node);
        expect(data.role).toBe('textbox');
        expect(data.name).toBe(name);
        expect(data.value).toBe(value);
    });
    test('nodeParser parses select tags', () => {
        var selectName = "test-select";
        var selectValue = "Test Select";
        var optionName = "test-option";
        var optionValue = "Test Option";
        var html = `<select name="${selectName}" aria-label="${selectValue}"><option name="${optionName}">${optionValue}</option></select>`;
        var node = htmlToElement(html, 'select');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var data = nodeParser.parse(node);
        expect(data.role).toBe('combobox');
        expect(data.name).toBe(selectName);
        expect(data.value).toBe(selectValue);

        node = htmlToElement(html, 'option');
        nodeParser = new NodeParser({
            rootNode: node
        });
        data = nodeParser.parse(node);
        expect(data.role).toBe('option');
        expect(data.name).toBe(optionName);
        expect(data.value).toBe(optionValue);
    });
    test('nodeParser parses button tag', () => {
        var name = 'test-button';
        var value = 'Test Button';
        var node = htmlToElement(`<button name="${name}">${value}</button>`, 'button');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var data = nodeParser.parse(node);
        expect(data.role).toBe('button');
        expect(data.name).toBe(name);
        expect(data.value).toBe(value);
    });

    // Tables.
    test('nodeParser parses table tags', () => {
        var captionValue = "Table Caption";
        var headingValue = "Table Heading";
        var cellValue = "Table Cell";
        var html = `<table><caption>${captionValue}</caption><tr><th>${headingValue}</th><td>${cellValue}</td></tr></table>`;
        var node = htmlToElement(html, 'table');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var data = nodeParser.parse(node);
        expect(data.role).toBe('table');
        expect(data.name).toBe(undefined);
        expect(data.value).toBe(captionValue);

        node = htmlToElement(html, 'caption');
        nodeParser = new NodeParser({
            rootNode: node
        });
        data = nodeParser.parse(node);
        expect(data.role).toBe('table caption');
        expect(data.name).toBe(undefined);
        expect(data.value).toBe(captionValue);

        node = htmlToElement(html, 'tr');
        nodeParser = new NodeParser({
            rootNode: node
        });
        data = nodeParser.parse(node);
        expect(data.role).toBe('table row');
        expect(data.name).toBe(undefined);
        expect(data.value).toBe(headingValue + cellValue);

        node = htmlToElement(html, 'th');
        nodeParser = new NodeParser({
            rootNode: node
        });
        data = nodeParser.parse(node);
        expect(data.role).toBe('table heading');
        expect(data.name).toBe(undefined);
        expect(data.value).toBe(headingValue);

        node = htmlToElement(html, 'td');
        nodeParser = new NodeParser({
            rootNode: node
        });
        data = nodeParser.parse(node);
        expect(data.role).toBe('table cell');
        expect(data.name).toBe(undefined);
        expect(data.value).toBe(cellValue);

    });

});
