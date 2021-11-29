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
        expect(nodeParser.getListItemChildren(node).length).toBe(0);
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

            // Tests for inputs with ARIA labels.
            const role = type === "reset" || type === "submit"
                ? "button" : type === "text"
                ? "textbox" : type;
            const nodeName = `test-${type}`;
            const accessibleName = `Test ${type}`;
            const nodeValue = `My ${type} value`;
            var node = htmlToElement(`<input type="${type}" aria-label="${accessibleName}" name="${nodeName}" value="${nodeValue}"/>`, 'input');
            nodeParser = new NodeParser({
                rootNode: node
            });
            var aNode = nodeParser.parse(node);
            expect(aNode.role).toBe(role);
            var name = accessibleName;
            var value = nodeValue;
            var nameValueText = `${aNode.name}${aNode.separator}${aNode.value}`;
            if (type === 'reset' || type === 'submit') {
                name = nodeValue;
                value = '';
                nameValueText = name;
            }
            expect(aNode.name).toBe(name);
            expect(aNode.value).toBe(value);
            expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${nameValueText}`);

            // Tests for inputs with label tags.
            const nodeId = `test-${type}-id`;
            const html = `<body><form><label for="${nodeId}">${accessibleName}</label><input type="${type}" id="${nodeId}" name="${nodeName}" value="${nodeValue}"/></form></body>`;
            const tree = htmlToElement(html, 'body');
            node = htmlToElement(html, 'input');
            nodeParser = new NodeParser({
                rootNode: tree
            });
            aNode = nodeParser.parse(node);
            expect(aNode.role).toBe(role);
            expect(aNode.name).toBe(name);
            expect(aNode.value).toBe(value);
            expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${nameValueText}`);
        });
    });
    
    test('nodeParser parses radio button group input tags', () => {
    });

    test('nodeParser parses password input tag', () => {
        // Tests for password field  with ARIA label.
        var nodeName = 'test-password';
        var accessibleName = 'Test Password';
        var node = htmlToElement(`<input type="password" name="${nodeName}" aria-label="${accessibleName}" />`, 'input');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe(null);
        expect(aNode.name).toBe(nodeName);
        expect(aNode.value).toBe(accessibleName);
        expect(aNode.toString()).toBe(`${aNode.name}${aNode.separator}${aNode.value}`);

        // Tests for textarea with label tag.
        const nodeId = `test-password-id`;
        const html = `<body><form><label for="${nodeId}"><nput type="password" name="${nodeName}" id="${nodeId}" />`;
        const tree = htmlToElement(html, 'body');
        node = htmlToElement(html, 'input');
        expect(aNode.role).toBe(null);
        expect(aNode.name).toBe(nodeName);
        expect(aNode.value).toBe(accessibleName);
        expect(aNode.toString()).toBe(`${aNode.name}${aNode.separator}${aNode.value}`);
    });
    
    test('nodeParser parses textarea tag', () => {
        // Tests for textarea with ARIA label.
        var nodeName = 'test-textarea';
        var accessibleName = 'Test Textarea';
        var nodeValue = "textarea content";
        var node = htmlToElement(`<textarea name="${nodeName}" aria-label="${accessibleName}">${nodeValue}</textarea>`, 'textarea');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('textbox');
        expect(aNode.name).toBe(accessibleName);
        expect(aNode.value).toBe(nodeValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);

        // Tests for textarea with label tag.
        const nodeId = `test-textarea-id`;
        const html = `<body><form><label for="${nodeId}"><textarea name="${nodeName}" id="${nodeId}">${nodeValue}</textarea></form></body>`;
        const tree = htmlToElement(html, 'body');
        node = htmlToElement(html, 'textarea');
        expect(aNode.role).toBe('textbox');
        expect(aNode.name).toBe(accessibleName);
        expect(aNode.value).toBe(nodeValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);
    });
    
    test('nodeParser parses select tags', () => {

        // Tests for select element with ARIA label.
        var role = 'combobox';
        const selectNodeName = "test-select";
        const selectAccessibleName = "Test Select";
        const optionName = "test-option";
        const optionValue = "Test Option";
        var html = `<select name="${selectNodeName}" aria-label="${selectAccessibleName}"><option name="${optionName}">${optionValue}</option></select>`;
        var node = htmlToElement(html, 'select');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe(role);
        expect(aNode.name).toBe(selectAccessibleName);
        expect(aNode.value).toBe(optionValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);

        node = htmlToElement(html, 'option');
        nodeParser = new NodeParser({
            rootNode: node
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('option');
        expect(aNode.name).toBe(optionValue);
        expect(aNode.value).toBe(optionValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);

        // Tests for select with label tag.
        const nodeId = 'test-select-id';
        html = `<body><form><label for="${nodeId}">${selectAccessibleName}</label><select id="${nodeId}" name="${selectNodeName}"><option name="${optionName}">${optionValue}</option></select></form></body>`;
        var tree = htmlToElement(html, 'body');
        node = htmlToElement(html, 'select');
        nodeParser = new NodeParser({
            rootNode: tree
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe(role);
        expect(aNode.name).toBe(selectAccessibleName);
        expect(aNode.value).toBe(optionValue);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);

        // Tests for elements with listbox and listitem roles.
        role = 'listbox';
        const labelId = 'test-label';
        html = `<body><div id="${labelId}" role="label">${selectAccessibleName}</div><span role="${role}" id="${nodeId}" name="${selectNodeName}" aria-labelledby="${labelId}"><div role="option" name="${optionName}">${optionValue}</div></span></body>`;
        tree = htmlToElement(html, 'body');
        node = htmlToElement(html, 'span');
        nodeParser = new NodeParser({
            rootNode: tree
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe(role);
        // Not sure these two tests are accurate. May need additional ARIA attributes.
        // * aNode.name should be set to the label.
        // * aNode.value should be set to the option value.
        expect(aNode.name).toBe(selectNodeName);
        expect(aNode.value).toBe(selectAccessibleName);
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);
    });
    
    test('nodeParser parses radio button group input tags', () => {

        // Tests for radio button group in fieldset with legend.
        const groupName = 'Test Group';
        const nodeId = 'test-radio-id';
        const nodeName = 'test-radio';
        const label = 'Test Radio';
        const nodeValue = 'test-radio-value';
        const metadata = '(1 of 1) - checked';
        var html = `<body><form><fieldset><legend>${groupName}</legend><input type="radio" id="${nodeId}" name="${nodeName}" value="${nodeValue}" checked="checked"/><label for="${nodeId}">${label}<label</fieldset></form></body>`;
        var tree = htmlToElement(html, 'body');
        var node = htmlToElement(html, 'input');
        nodeParser = new NodeParser({
            rootNode: tree
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('radio');
        expect(aNode.name).toBe(groupName);
        expect(aNode.value).toBe(label);
        expect(aNode.metadata).toBe(metadata);
        expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);

        // Tests for ARIA "radiogroup" and "radio" roles.
        html = `<body><div role="radiogroup" aria-labelledby="heading"><h3 id=""heading">${groupName}</h3><span role="radio" aria-checked="true">${label}</span></div></body>`;
        tree = htmlToElement(html, 'body');
        node = htmlToElement(html, 'span');
        nodeParser = new NodeParser({
            rootNode: tree
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('radio');
        expect(aNode.name).toBe('');
        expect(aNode.value).toBe(label);
        expect(aNode.metadata).toBe(metadata);
        expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}${aNode.separator}${aNode.value}`);
    });

    test('nodeParser parses checkbox group input tags', () => {

        // Tests for checkboxgroup in fieldset with legend.
        const groupName = 'Test Group';
        const nodeId = 'test-checkbox-id';
        const nodeName = 'test-checkbox';
        const label = 'Test Checkbox';
        const nodeValue = 'test-checkbox-value';
        const metadata = '(1 of 1) - checked';
        var html = `<body><form><fieldset><legend>${groupName}</legend><input type="checkbox" id="${nodeId}" name="${nodeName}" value="${nodeValue}" checked="checked"/><label for="${nodeId}">${label}<label</fieldset></form></body>`;
        var tree = htmlToElement(html, 'body');
        var node = htmlToElement(html, 'input');
        nodeParser = new NodeParser({
            rootNode: tree
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('checkbox');
        expect(aNode.name).toBe(groupName);
        expect(aNode.value).toBe(label);
        expect(aNode.metadata).toBe(metadata);
        expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}${aNode.separator}${aNode.name}${aNode.separator}${aNode.value}`);

        // Tests for ARIA "checkbox" roles.
        html = `<body><div role="group" aria-labelledby="heading"><h3 id=""heading">${groupName}</h3><span role="checkbox" aria-checked="true">${label}</span></div></body>`;
        tree = htmlToElement(html, 'body');
        node = htmlToElement(html, 'span');
        nodeParser = new NodeParser({
            rootNode: tree
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('checkbox');
        expect(aNode.name).toBe('');
        expect(aNode.value).toBe(label);
        expect(aNode.metadata).toBe(metadata);
        expect(aNode.toString()).toBe(`${aNode.role} ${aNode.metadata}${aNode.separator}${aNode.value}`);
    });

    test('nodeParser parses button tag', () => {

        // Tests for button element.
        var nodeName = 'test-button';
        var accessibleName = 'Test Button';
        var node = htmlToElement(`<button name="${nodeName}">${accessibleName}</button>`, 'button');
        nodeParser = new NodeParser({
            rootNode: node
        });
        var aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('button');
        expect(aNode.name).toBe(accessibleName);
        expect(aNode.value).toBe('');
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}`);

        // Tests for element with button role.
        node = htmlToElement(`<div role="button" name="${nodeName}">${accessibleName}</div>`, 'div');
        nodeParser = new NodeParser({
            rootNode: node
        });
        aNode = nodeParser.parse(node);
        expect(aNode.role).toBe('button');
        expect(aNode.name).toBe(accessibleName);
        expect(aNode.value).toBe('');
        expect(aNode.toString()).toBe(`${aNode.role}${aNode.separator}${aNode.name}`);
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
