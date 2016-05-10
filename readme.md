# Likely

The social sharing buttons that aren’t shabby

## Install

Install via npm:

```sh
npm install ilyabirman-likely
```

Install via bower:

```sh
bower install ilyabirman-likely
```

Or download this repository and move files `release/likely.js` and 
`release/likely.css` to desired directory.

## Using with webpack

First, make sure that you install webpack's [json-loader](https://github.com/webpack/json-loader).

Next install **likely** via npm.

Then, initiate Likely:

```js
// on document ready or in the end
require('ilyabirman-likely').initiate();
```

Instruction for using with webpack provided by @Corey-Maler.

## Setup

After you've installed Likely, you need to setup Likely. First, you need to 
include compiled sources.

With bower:

```html
<!-- Head -->
<link href="bower_components/Likely/release/likely.css" 
      rel="stylesheet">
<!-- End of body -->
<script src="bower_components/Likely/release/likely.js" 
        type="text/javascript"></script>
```

With npm:

```html
<!-- Head -->
<link href="node_modules/ilyabirman-likely/release/likely.css" 
      rel="stylesheet">
<!-- End of body -->
<script src="node_modules/ilyabirman-likely/release/likely.js" 
        type="text/javascript"></script>
```

Or just include files named `likely.css` and `likely.js`.

Then you'll need to create HTML container with `likely` class and list desired 
social networks in child divs:

```html
<div class="likely">
    <div class="facebook">Share</div>
    <div class="twitter">Tweet</div>
    <div class="gplus">+1</div>
    <div class="vkontakte">Share</div>
    <div class="pinterest">Pin</div>
    <div class="odnoklassniki">Share</div>
    <div class="telegram">Share</div>
</div>
```

Likely supports following social networks:

* `facebook` – Facebook
* `twitter` – Twitter
* `gplus` - Google+
* `vkontakte` – VK
* `pinterest` – Pinterest
* `odnoklassniki` – Odnoklassniki
* `telegram` – Telegram

Also, you can have several Likely button sets on the page. Just create another 
container and set needed options.

## Options

You can set some options on Likely button set via `data-*` attributes:

* `data-url` – URL to share and load counters for
* `data-title` – Page title

There's also social network specific options.

### Twitter

You can set `data-via` attribute on Twitter button to insert username mention 
of this user:

```html
<div class="twitter" data-via="ilyabirman">Tweet</div>
```

### Pinterest

You can set `data-media` attribute include some media file to share on pinterest.
It is suppose to be a URL to media file:

```html
<div class="pinterest" data-media="https://placekitten.com/200/400">Pin</div>
```

## Supported browsers

We support IE 10+, Safari 9+ and the latest versions of Chrome, Firefox and Edge. Likely could work in the older versions too, but we don’t do anything specific to maintain its compatibility with them and don’t test it there. 

## Demo

You can see Likely in action on its [homepage](http://ilyabirman.net/projects/likely/).
