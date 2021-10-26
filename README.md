# Site Unseen

## Overview

Site Unseen is a JavaScript library and soon-to-be web browser extension that allows you to interact with any web page in the same way a person with blindness would experience it. 

Based on [Inclusiville](https://inclusiville.com/), the [award-winning](https://www.deque.com/blog/deque-hosts-first-virtual-axe-hackathon/) empathy-building game for web accessibility, Site Unseen hides all visible elements on a web page and provides you with a simulated screen reader to explore its contents. Use keyboard commands to move through the elements on a page, viewing the name, role, and value of each one as it comes into focus and interacting with it using only your keyboard.

With Site Unseen, you can:

* Experience any web page the same way that people with blindness or visual impairments do.
* Test for web accessibility issues, and gain first-hand insight about their impact on a website's users.
* Build empathy in website owners and stakeholders for users with disabilities who visit their sites.
* Develop business cases for web accessibility projects.

## Features

* Navigate the contents of a web page using the arrow keys, viewing details about each element as you explore.
* Use Quick Keys to quickly move access the list of headings, regions, links, and forms on a web page.
* Temporarily lighten the opaque overlay to get a glimipse of the page and find your bearings if you get stuck.

## Setup and Usage

To see Site Unseen on a sample web page, issue the following commands in a Mac OSX or Unix terminal window.

```
git clone https://github.com/simonminer/site-unseen.git
cd site-unseen
npm install
./bin/run-server.sh
```

Then point your web browser to [http://localhost:8080/](http://localhost:8080/).

When you are finished, press `Ctrl-C` on the command line to stop the server.


