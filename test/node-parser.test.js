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
            var aNode = nodeParser.parse(node);
            expect(nodeParser.parseHeadingLevel(aNode)).toBe(i.toString());
            expect(aNode.role).toBe('heading');
            expect(aNode.metadata).toBe(`level ${i}`);
            expect(aNode.name).toBe(undefined);
            expect(aNode.value).toBe(`Heading level ${i}`);
            expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}${aNode.separator}Heading level ${i}`);
            expect(aNode.virtualNode.hasAttr('foo')).toBe(false);

            node = htmlToElement(`<div role="heading" aria-level="${i}">Heading level ${i}</div>`, 'div');
            nodeParser = new NodeParser({
                rootNode: node
            });
            aNode = nodeParser.parse(node);
            expect(nodeParser.parseHeadingLevel(aNode)).toBe(i.toString());
            expect(aNode.role).toBe('heading');
            expect(aNode.metadata).toBe(`level ${i}`);
            expect(aNode.name).toBe(undefined);
            expect(aNode.value).toBe(`Heading level ${i}`);
            expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}${aNode.separator}Heading level ${i}`);
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
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe(null);
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe(text);
        expect(aNode.toString()).toBe(text);
    });
    test('nodeParser parses link tags', () => {
        var linkText = "This is a link";
        var name = "test-link";
        var node = htmlToElement(`<a href="#" name="${name}">${linkText}</a>`, 'a');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('link');
        expect(aNode.name).toBe(name);
        expect(aNode.value).toBe(linkText);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${name}${aNode.separator}${linkText}`);

        node = htmlToElement(`<div role="link" name="${name}" href="#">${linkText}</div>`, 'div');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('link');
        expect(aNode.name).toBe(name);
        expect(aNode.value).toBe(linkText);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${name}${aNode.separator}${linkText}`);
    });
    test('nodeParser parses list tags', () => {
        ['ol', 'ul'].forEach(function(tagName) {
            var listItemText = "Item 1";
            var listNode = htmlToElement(`<${tagName}><li>${listItemText}</li></${tagName}>`, tagName);
            nodeParser = new NodeParser({
                rootNode: listNode
            });
            var aNode = nodeParser.parse(listNode);
            var listItemCount = listNode.getElementsByTagName('li').length;
            var listItems = nodeParser.getListItemChildren(aNode);
            expect(listItems.length).toBe(listItemCount);
            expect(nodeParser.countListItems(aNode)).toBe(listItemCount);
            expect(aNode.role).toBe('list');
            expect(aNode.metadata).toBe(`(${listItemCount} item)`);
            expect(aNode.name).toBe(undefined);
            expect(aNode.value).toBe('');
            expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}`);

            var listItemNode = listNode.querySelector('li');
            aNode = nodeParser.parse(listItemNode);
            expect(aNode.role).toBe("listitem");
            expect(aNode.name).toBe(undefined);
            expect(aNode.value).toBe(listItemText);
            expect(aNode.metadata).toBe(`(1 of ${listItems.length})`);
            expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}${aNode.separator}${aNode.value}`);
        });

        var listNode = htmlToElement(`<section role="list"><div role="listitem">Item 1</div><div role="listitem">Item 2</div></section>`, 'section');
        nodeParser = new NodeParser({
            rootNode: listNode
        });
        var aNode = nodeParser.parse(listNode);
        var listItems = nodeParser.getListItemChildren(aNode);
        expect(nodeParser.countListItems(aNode)).toBe(listItems.length);
        expect(aNode.role).toBe('list');
        expect(aNode.metadata).toBe(`(${listItems.length} items)`);
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe('');
        expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}`);

        var listItems = nodeParser.getListItemChildren(aNode);
        for (var i = 0, l = listItems.length; i < l; i++) {
            aNode = nodeParser.parse(listItems[i].actualNode);
            expect(aNode.role).toBe("listitem");
            expect(aNode.name).toBe(undefined);
            expect(aNode.value).toBe(`Item ${i + 1}`);
            expect(aNode.metadata).toBe(`(${i + 1} of ${listItems.length})`);
            expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}${aNode.separator}${aNode.value}`);
        }

        var node = htmlToElement('<p>Not a list</p>', 'p');
        nodeParser = new NodeParser({
            rootNode: node
        });
        expect(nodeParser.countListItems(node)).toBe(undefined);
    });
    test('nodeParser parses definition list tags', () => {
        var html = "<dl><dt>Term</dt><dd>Definition</dd></dl>";
        var node = htmlToElement(html, 'dl');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe("definition list");
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe('TermDefinition');
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.value}`);

        node = htmlToElement(html, 'dt');
        nodeParser = new NodeParser({
            rootNode: node
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('term');
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe("Term");
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.value}`);

        node = htmlToElement(html, 'dd');
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('definition');
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe("Definition");
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.value}`);
    });
    test('nodeParser parses image tags', () => {
        var altText = "Sample image";
        var src = "image.png";
        var node = htmlToElement(`<img src="${src}" alt="${altText}" />`, 'img');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe("img");
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe(altText);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.value}`);

        node = htmlToElement(`<div role="img" aria-label="${altText}">Test</div>`, 'div');
        nodeParser = new NodeParser({
            rootNode: node
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe("img");
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe(altText);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.value}`);

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
            var aNode = nodeParser.parse(node);
            expect(aNode.role).toBe(role);
            expect(aNode.name).toBe(name);
            expect(aNode.value).toBe(value);
            expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);
        });
    });
    test('nodeParser parses textarea tag', () => {
        var name = 'test-textarea';
        var value = 'Test Textarea';
        var node = htmlToElement(`<textarea name="${name}" aria-label="${value}">${value} Value</button>`, 'textarea');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('textbox');
        expect(aNode.name).toBe(name);
        expect(aNode.value).toBe(value);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);
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
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('combobox');
        expect(aNode.name).toBe(selectName);
        expect(aNode.value).toBe(selectValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);

        node = htmlToElement(html, 'option');
        nodeParser = new NodeParser({
            rootNode: node
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('option');
        expect(aNode.name).toBe(optionName);
        expect(aNode.value).toBe(optionValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);

        // TODO Add tests for listbox control
    });
    test('nodeParser parses button tag', () => {
        var name = 'test-button';
        var value = 'Test Button';
        var node = htmlToElement(`<button name="${name}">${value}</button>`, 'button');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('button');
        expect(aNode.name).toBe(name);
        expect(aNode.value).toBe(value);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);

        // TODO Add test for button custom control.
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
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('table');
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe(captionValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.value}`);

        node = htmlToElement(html, 'caption');
        nodeParser = new NodeParser({
            rootNode: node
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('table caption');
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe(captionValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.value}`);

        node = htmlToElement(html, 'tr');
        nodeParser = new NodeParser({
            rootNode: node
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('table row');
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe(headingValue + cellValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.value}`);

        node = htmlToElement(html, 'th');
        nodeParser = new NodeParser({
            rootNode: node
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('table heading');
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe(headingValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.value}`);

        node = htmlToElement(html, 'td');
        nodeParser = new NodeParser({
            rootNode: node
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('table cell');
        expect(aNode.name).toBe(undefined);
        expect(aNode.value).toBe(cellValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.value}`);

        // TODO Add tests for table, columnheading, row, and cell roles.
    });

    // Region/landmark elements.
    test('nodeParser parses landmark elements', () => {
        ['aside', 'footer', 'header', 'main', 'nav'].forEach(function(tagName) {
            const node = htmlToElement(`"<${tagName}>Test Content</${tagName}>`, tagName );
            nodeParser = new NodeParser({
                rootNode: node
            });
            const aNode = nodeParser.parse(node);
            expect(nodeParser.landmarkRoles.includes(aNode.role)).toBe(true);
            expect(aNode.metadata).toBe('region');
            expect(aNode.name).toBe(undefined);
            expect(aNode.value).toBe('');
            expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}`);
        });

        nodeParser.landmarkRoles.forEach(function(role) {
            const node = htmlToElement(`"<div role="${role}">Test Contents</div>`, 'div');
            nodeParser = new NodeParser({
                rootNode: node
            });
            const aNode = nodeParser.parse(node);
            expect(aNode.role).toBe(role);
            expect(aNode.metadata).toBe('region');
            expect(aNode.name).toBe(undefined);
            expect(aNode.value).toBe('');
            expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}`);
        });
    });
});
