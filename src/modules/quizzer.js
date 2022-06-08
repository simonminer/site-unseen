/**
 * Class to generate and administer quizzes about
 * a web page's contents using this systems' screen reader
 * emulator.
 */

'use strict';

import { Config } from './config.js';
import { Overlay } from './overlay.js';

export class Quizzer {

    /**
     * Shortcut key manager object
     * constructed from the contents
     * of the current page.
     */
    shortcutKeyManager = undefined;

    /**
     * List of types of questions
     * available based on the accessible
     * contents of the current page.
     * @type {Array[String]}
     */
    questionTypes = [];

    /* List of question and answer pairs
     * about current page's content, 
     * @type {Array[Object]}
     */
    questions = undefined;

    /**
     * The index of the question currently
     * being posed to the user.
     * @type {int}
     */
    currentQuestionIndex = -1;

    /**
     * ID of the quizzer element
     * @type {String}
     */
    static id = `${Config.cssPrefix}quizzer`;

    /**
     * Quizzer CSS rules
     * @type {String}
     */
    css = `
#${Quizzer.id} {
    width: 900px;
    max-width: 80%;
    margin: auto;
    box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%);
    font-family: sans-serif;
    font-size: 16px;
    background-color: #fff;
    color: #1c4bad;
    border-radius: 10px;
    position: relative;
    top: 10%;
    z-index: 100;
    padding: 5px;
}
`;

    /**
     * HTML for the Quizzer display
     * @type {Sting}
     */
    html = `
<div id="${Quizzer.id}" class="${Overlay.hiddenClassName}" role="dialog" aria-modal="true">
    <div class="${Config.cssPrefix}quizzer-heading ${Config.cssPrefix}desktop">
        <h2>Quizzer</h2>
        <button class="${Quizzer.closeButtonClassName}">x</button>
    </div>
`;

    static _properties = [
        'id', 'css', 'html', 'shortcutKeyManager',
        'questionTypes', 'questions', 'currentQuestionIndex'
    ];

    /**
     *
     * @param {ShortcutKeyManager} skm - ShortcutKeyManager object for the current page.
     * @param {Object} properties - Set of key/value pairs to override the default properties of this class.
     * @returns {Quizzer} - A new instance of the Quizzer class.
     */
    constructor(skm, properties) {
        if (properties !== undefined) {
            Overlay._properties.forEach((property) => {
                if (properties.hasOwnProperty(property)) {
                    this[property] = properties[property];
                }
            });
        }
    }

    /**
     * Parses the specified ShortcutKeyManager to construct a list of potential types
     * of questions that can be asked of the user based on the contents of the page.
     * Examples of entries include:
     * - heading_count - How many headings does the page contain?
     * - heading_contents - What is the text of the Nth heading on the page?
     * - heading_level - What level does the Nth heading have?
     * - image_text - What is the accessible text of the Nth image on the page?
     *
     * @param {ShortcutKeyManager} skm - ShortcutKeyManager object for the current page.
     * @returns {Arrya{String}}- List of available question types based on the contents of the current page.
     */
    buildQuestionTypeList(skm = this.shortcutKeyManager) {
        // Loop through skm adding question types based on presence
        // and counts of headings, images, links, buttons, form fields, etc.
    }

    /**
     * Generates the specified number of questions based on the for the 
     * contents of and question types available for the current page.
     *
     * @param {int} questionCount - Number of questions to generate.
     * @returns {Array{Object}}- List of question/answer pairs to ask the user.
     */
    generateQuestions(questionCount) {
        // Randomly select questionCount question types
        // For each question type
        // * Generate the question and answer for the question type (may entail functions or subclasses).
        // * Remove the type from the questionTypes list.
        // Return the question/answer list.
    }
}
