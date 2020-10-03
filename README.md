![Likely logo](logo.png)

The social sharing buttons that aren’t shabby

## Take a look

See Likely in action on its [homepage](http://ilyabirman.net/projects/likely/).

[![Likely screenshot](http://i.imgur.com/ipqE5Tu.png)](http://ilyabirman.net/projects/likely/)

Likely supports following social networks:

* `facebook` – Facebook
* `twitter` – Twitter
* `vkontakte` – VK
* `pinterest` – Pinterest
* `odnoklassniki` – Odnoklassniki
* `telegram` – Telegram
* `linkedin` – LinkedIn
* `whatsapp` – WhatsApp
* `viber` – Viber
* `reddit` – Reddit

## Get

[Download the repository code](https://github.com/ilyabirman/Likely/archive/master.zip) and move `release/likely.js` and
`release/likely.css` to the desired directory (or `likely.min.js` & `likely.min.css` if you prefer them optimized).

Or use npm or Bower:

```sh
$ npm install ilyabirman-likely --save
$ bower install ilyabirman-likely --save
```

Also you can use Likely from CDN:

https://unpkg.com/ilyabirman-likely@2/release/likely.min.css
<br>
https://unpkg.com/ilyabirman-likely@2/release/likely.min.js

or

https://unpkg.com/ilyabirman-likely@2/release/likely.css
<br>
https://unpkg.com/ilyabirman-likely@2/release/likely.js

## Setup

Link the files `likely.css` and `likely.js` from the compiled sources. In place of the each file the minified `.min.` versions can be used as well.

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

Then, create a `div` with the class `likely` and list necessary social networks:

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
    <div class="viber">Send</div>
    <div class="reddit">Share</div>
</div>
```

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

These options can be specified on the `div` with the `likely` class. Please note that they matter to not all of the services, please refer the documentation below.


* `data-url` – URL to share and load counters for, defaults to the current page URL. ⚠ Specify the full URL with the protocol – like in `https://ilyabirman.com` – because some social networks don’t recognize the partial one.

* `data-title` – defaults to the page title.

* `data-counters` – pass "no" to disable counters (enabled by default)

```html
<div class="likely" data-url="https://github.com/ilyabirman/Likely">
    <!-- list of serivces -->
</div>
```

### Facebook
```html
<div class="facebook" data-quote="Best website ever!" data-hashtag="#puppies">Share</div>
```
Common params: **url**, **counters**.

Custom params: 
1. **quote** - adds non-editable(but removable) text to the shared link.
2. **hashtag** - a single word with hash(#) symbol, which is included in the post.

Supports [Open Graph Protocol](https://ogp.me/) meta tags: 
[og:url, og:type, og:title, og:description, og:image, og:type, og:locale](https://developers.facebook.com/docs/sharing/webmasters)

### Linkedin
```html
<div class="linkedin">Post</div>
``` 
Common params: **url**

Custom params: none.

Supports [Open Graph Protocol](https://ogp.me/) meta tags: 
[og:title, og:image, og:description, og:url](https://www.linkedin.com/help/linkedin/answer/46687/making-your-website-shareable-on-linkedin).

### OK (Odnoklassniki)
```html
<div class="odnoklassniki">Like</div>
```
Common params: **url**, **title**

Custom params: none.

Supports [Open Graph Protocol](https://ogp.me/) meta tags:
[og:title, og:description, og:image, og:video](https://apiok.ru/en/ext/like).
### Twitter

You can set `data-via` attribute to mention a specific user in the tweet:

```html
<div class="twitter" data-via="ilyabirman">Tweet</div>
```

With `data-via="ilyabirman"`, the tweet text will include “via @ilyabirman”. Read more about the `via` parameter [in Twitter documentation](https://dev.twitter.com/web/tweet-button#component-via).

### Telegram

You can set `data-text` attribute to define a text of the message. 
Doesn't use `data-title`.

```html
<div class="telegram" data-text="Check this out">Send</div>
```

### Pinterest

You can set `data-media` attribute to override a default image and substitute a different one in the Pin Create form.
The attribute should be an image URL:

```html
<div class="pinterest" data-media="https://placekitten.com/200/400">Pin</div>
```

Read more about the `media` parameter [in Pinterest documentation](https://developers.pinterest.com/docs/widgets/pin-it/#source-settings).

### VK

You can set `data-image` and `data-description` attributes to set up an image and a description accordingly:

```html
<div class="vkontakte" data-image="https://placekitten.com/200/400" data-description="Check this out">Share</div>
```

### Viber
You can set `data-comment` attribute to specify some text that's going to be added to a shared link (on a separate line).
Doesn't use `data-title`.

```html
<div class="viber" data-comment="Check this out">Send</div>
```

### Reinitialize configuration on change data attributes

If you need to dynamically change a widget's configuration, you can re-initialize the widget and invoke the configuration update logic on the *Likely* instance using the `init` method.

```javascript
// Use global object, created by the library
likely.initiate();
// If you need to refresh the counters, pass the corresponding param,
// but be aware that it will issue xhr calls to all the relevant services.
likely.initiate({forceUpdate:true});
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
    <div class="whatsapp" tabindex="0" role="link" aria-label="Send on WhatsApp">Send</div>
    <div class="viber" tabindex="0" role="link" aria-label="Send on Viber">Send</div>
    <div class="reddit" tabindex="0" role="link" aria-label="Share on Reddit">Share</div>
</div>
```

## Supported browsers

We support IE 10+, Safari 9+ and the latest versions of Chrome, Firefox and Edge. Likely might work in the older versions too but we don’t maintain the compatibility on purpose.

## Deprecations 
In version 3.0 the following is going to be changed:
1. Classes `likely-visible` and `likely-ready` will be merged into just `likely-ready`, so please don't rely on `likely-visible` to test the presence.
2. Unrecognized params passed to the services will be ignored.
3. Old initialization method will be removed.
4. Likely buttons will be changed from <div> to <button> tag.

There are deprecation warnings implemented in 2.5 for all the above.  

# Development
Please use the [Github commit style](https://gist.github.com/robertpainsi/b632364184e70900af4ab688decf6f53).
Before pushing make sure the tests are green and the linter does not complain. 
```bash
npm test
npm run-script check-codestyle
```
Also, please, add your own tests if you are submitting a feature. 
[![Build Status](https://travis-ci.org/NikolayRys/Likely.svg?branch=master)](https://travis-ci.org/NikolayRys/Likely)

## Release
Release packaging before publishing: 
```
$ npm run release
```
