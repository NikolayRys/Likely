# Likely

The social sharing buttons that aren’t shabby

[![Likely screenshot](http://i.imgur.com/ipqE5Tu.png)](http://ilyabirman.net/projects/likely/)

## Take a look

See Likely in action on its [homepage](http://ilyabirman.net/projects/likely/).

## Get

[Download the repository code](https://github.com/ilyabirman/Likely/archive/master.zip) and move `release/likely.js` and
`release/likely.css` to the desired directory.

Or use npm or Bower:

```sh
$ npm install ilyabirman-likely --save
$ bower install ilyabirman-likely --save
```

Also you can use Likely from CDN:

https://unpkg.com/ilyabirman-likely@2/release/likely.css
<br>
https://unpkg.com/ilyabirman-likely@2/release/likely.js

## Setup

Link the files `likely.css` and `likely.js` from the compiled sources.

If downloaded directly:
```html
<!-- Head -->
<link href="path/to/likely.css" rel="stylesheet">
<!-- End of body -->
<script src="path/to/likely.js" type="text/javascript"></script>
```

If installed with npm:

```html
<!-- Head -->
<link href="node_modules/ilyabirman-likely/release/likely.css"
      rel="stylesheet">
<!-- End of body -->
<script src="node_modules/ilyabirman-likely/release/likely.js"
        type="text/javascript"></script>
```

If installed with Bower:

```html
<!-- Head -->
<link href="bower_components/Likely/release/likely.css"
      rel="stylesheet">
<!-- End of body -->
<script src="bower_components/Likely/release/likely.js"
        type="text/javascript"></script>
```

Then, create a `div` with the class `likely` and list necessary social networks in child `div`s:

```html
<div class="likely">
    <div class="facebook">Share</div>
    <div class="twitter">Tweet</div>
    <div class="vkontakte">Share</div>
    <div class="pinterest">Pin</div>
    <div class="odnoklassniki">Like</div>
    <div class="telegram">Send</div>
    <div class="linkedin">Share</div>
    <div class="whatsapp">Send</div>
</div>
```
Likely supports following social networks:

* `facebook` – Facebook
* `twitter` – Twitter
* `vkontakte` – VK
* `pinterest` – Pinterest
* `odnoklassniki` – Odnoklassniki
* `telegram` – Telegram
* `linkedin` – LinkedIn
* `whatsapp` – WhatsApp

If you need several Likely widgets on the page, just create another `div` with the class `likely` and list the social networks in it.

### Using as a CommonJS module

Likely can be used as a CommonJS module, so you can use it within webpack or browserify build systems.

First, install Likely using npm:

```sh
$ npm install ilyabirman-likely --save
```

Then, use it as CommonJS module somewhere in your program:

```js
var likely = require('ilyabirman-likely');

// Finds all the widgets in the DOM and initializes them
likely.initiate();
```

## Options

You can configure Likely by specifying `data-*` attributes on a button group or on a button.

### Common options

These options should be specified on the `div` with the `likely` class.

* `data-url` – URL to share and load counters for (⚠ specify the full URL with the protocol – like in `https://ilyabirman.com` – because some social networks don’t recognize the partial one)


* `data-title` – Page title

```html
<div class="likely" data-url="https://github.com/ilyabirman/Likely">
    <!-- ... -->
</div>
```

### Twitter

You can set `data-via` attribute to mention a specific user in the tweet:

```html
<div class="twitter" data-via="ilyabirman">Tweet</div>
```

With `data-via="ilyabirman"`, the tweet text will include “via @ilyabirman”. Read more about the `via` parameter [in the Twitter documentation](https://dev.twitter.com/web/tweet-button#component-via).

### Telegram

You can set `data-text` attribute to define a text of the message.

```html
<div class="telegram" data-text="Check this out">Send</div>
```

### Pinterest

You can set `data-media` attribute to override a default image and substitute a different one in the Pin Create form.
The attribute should be an image URL:

```html
<div class="pinterest" data-media="https://placekitten.com/200/400">Pin</div>
```

Read more about the `media` parameter in the [in the Pinterest documentation](https://developers.pinterest.com/docs/widgets/pin-it/#source-settings).


### VK

You can set `data-image` and `data-description` attributes to set up an image and a description accordingly:

```html
<div class="vkontakte" data-image="https://placekitten.com/200/400" data-description="Check this out">Share</div>
```

### Accessibility Settings

To make buttons accessible for keyboard navigation and screen readers add `tabindex`, `role` and `aria-label` attributes:

```html
<div class="likely">
    <div class="facebook" tabindex="0" role="link" aria-label="Share on Facebook">Share</div>
    <div class="twitter" tabindex="0" role="link" aria-label="Tweet on Twitter">Tweet</div>
    <div class="vkontakte" tabindex="0" role="link" aria-label="Share on Vkontakte">Share</div>
    <div class="pinterest" tabindex="0" role="link" aria-label="Pin on Pinterest">Pin</div>
    <div class="odnoklassniki" tabindex="0" role="link" aria-label="Like on Odnoklassniki">Like</div>
    <div class="telegram" tabindex="0" role="link" aria-label="Send on Telegram">Send</div>
    <div class="linkedin" tabindex="0" role="link" aria-label="Share on LinkedIn">Share</div>
    <div class="whatsapp" tabindex="0" role="link" aria-label="Send on WhatsApp">Share</div>
</div>
```

## Supported browsers

We support IE 10+, Safari 9+ and the latest versions of Chrome, Firefox and Edge. Likely could work in the older versions too, but we don’t do anything specific to maintain its compatibility with them and don’t test it there.

# Development
Please use the [Github commit style](https://gist.github.com/robertpainsi/b632364184e70900af4ab688decf6f53).
Before pushing make sure the tests are green and the linter does not complain. 
```bash
npm test
npm run-script check-codestyle
```
Also please add your own tests if you are submitting a feature.
