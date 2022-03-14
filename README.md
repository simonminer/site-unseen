<img src="media/site-unseen-logo.png" alt="Site Unseen Logo" style="float:right;width:100px" />

# Site Unseen

## Overview

Site Unseen is an up and coming JavaScript library, web application, and browser
extension that allows you to interact with any web page in the same way a person
with blindness would experience it.

Based on [Inclusiville](https://inclusiville.com/), the
[award-winning](https://www.deque.com/blog/deque-hosts-first-virtual-axe-hackathon/)
empathy-building game for web accessibility, Site Unseen hides all visible
elements on a web page and provides you with a simulated screen reader to
explore its contents. Use keyboard commands to move through the elements on a
page, viewing the name, role, and value of each one as it comes into focus and
interacting with it using only your keyboard.

With Site Unseen, you can:

-   Experience any web page the same way that people with blindness or visual
    impairments do.
-   Test for web accessibility issues, and gain first-hand insight about their
    impact on a website's users.
-   Provide individuals studying web accessibility with a useful and
    enlightening exercise or assignment.
-   Build empathy in website owners and stakeholders for users with disabilities
    who visit their sites.
-   Develop business cases for web accessibility projects.

Check out [https://siteunseen.dev/](https://siteunseen.dev) for more
information.

## Features

-   Navigate through the contents of a web page using the arrow keys, viewing
    information about each element as you explore.
-   Use shortcut Keys to access lists of headings, regions, and links on a web
    page and quickly navigate to them.
-   Temporarily lighten the opaque overlay to get a glimpse of the page and find
    your bearings if you get stuck.

## Setup and Usage

To see Site Unseen in action on a sample web page, issue the following commands
in a Mac OS or Unix terminal window.

```
git clone https://github.com/simonminer/site-unseen.git
cd site-unseen
npm install
npm run server
```

Then point your web browser to [http://localhost:8080/](http://localhost:8080/).

When you are finished, press `Control+C` on the command line to stop the server.

## Keyboard Commands

Use the following keyboard commands to navigate through the contents of a web
page with Site Unseen.

| Command               | Description                                                                                                                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tab` and `Shift+Tab` | Move back and forth between the interactive elements on the page (i.e. links, form fields), just like you normally do in a web browser.                                                                                                     |
| `←` and `→`           | Move back and forth between accessible element. Both interactive and non-interactive elements can be accessible, and most elements containing viewable content should be accessible, but this may or may not be the case for all web pages. |
| `↑` and `↓`           | Move between options in a list of radio buttons, checkboxes, or menue items.                                                                                                                                                                |
| `Space`               | Select the current option from a list of radio buttons, checkboxes, or menu items.                                                                                                                                                          |
| `Enter`               | Activate the interactive element you are currently focused on -- i.e. follow a link, press a button, check or uncheck a box, etc.                                                                                                           |
| *                       | Display the web page content visually for a few seconds.                                                                                                                                                                                  |
| ?                       |  Display a listing of keyboard commands and what they do.                                                                                                                                                                                 |
| `b` and `B`           | Cycle back and forth through the buttons on the page.                                                                                                                                                                                       |
| `f` and `F`           | Cycle back and forth through the form fields on the page.                                                                                                                                                                                   |
| `h` and `H`           | Cycle back and forth through the headings on the page.                                                                                                                                                                                      |
| `k` and `K`           | Cycle back and forth through the links on the page.                                                                                                                                                                                         |
| `l` and `L`           | Cycle back and forth through the ordered, unordered, and definition lists on the page.                                                                                                                                                      |
| `r` and `R`           | Move back and forth to the regions/landmarks on the page (i.e. heading, main, footer, etc.).                                                                                                                                                |
