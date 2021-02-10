![Likely logo](logo.png)

The social sharing buttons that aren’t shabby.

Version [2.6](https://github.com/NikolayRys/Likely/releases/tag/v2.6) is out 🎉

## Take a look

See Likely in action on its [homepage](http://ilyabirman.net/projects/likely/).

[![Likely screenshot](http://i.imgur.com/ipqE5Tu.png)](http://ilyabirman.net/projects/likely/)

Likely supports following social networks and messengers:

* `facebook` – Facebook
* `linkedin` – LinkedIn
* `odnoklassniki` – OK (Odnoklassniki)
* `pinterest` – Pinterest
* `reddit` – Reddit
* `telegram` – Telegram
* `twitter` – Twitter
* `viber` – Viber
* `vkontakte` – VK
* `whatsapp` – WhatsApp

## Get
[Download the last release](https://github.com/NikolayRys/Likely/releases/download/v2.6/ilyabirman-likely-2.6.zip) and move `likely.js` and
`likely.css` to the desired directory.

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

Link the files `likely.css` and `likely.js` from the compiled sources. Minified `.min.` versions also can be used for this.

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

## Service options
You can configure Likely by specifying `data-*` attributes on a button group with the `likely` class or on the button of a specific service.

Top-level options are passed down to all the services. They can also be overridden on an individual service tag.
* `data-url` – URL to share and load counters for, defaults to the current page URL. ⚠ Specify the full URL with the protocol – like in `https://ilyabirman.com` – because some social networks don’t recognize the partial one.
* `data-title` – Text that will be added to the shared URL. Defaults to the page title.
```html
<div class="likely" data-url="https://github.com/ilyabirman/Likely" data-title="My page">
    <!-- list of serivces -->
</div>
```

In 2020 most social networks rely on what is called [Open Graph Protocol](https://ogp.me/) to extract the information about shared links.
Below there is more information regarding how individual services support it,
but it's highly recommended to set up the proper <meta> tags for your page, to work in conjunction with Likely.

## Services
### Facebook
```html
<div class="facebook" data-quote="Best website ever!" data-hashtag="#puppies">Share</div>
```
* **url** - url to share.
* **quote** - adds non-editable(but removable) text to the shared link.
* **hashtag** - a single word with hash(#) symbol, which is included in the post.
* **counter** - if provided, blocks the API call and instead shows the given value.

[Facebook Open Graph protocol documentation](https://developers.facebook.com/docs/sharing/webmasters)

### Linkedin
```html
<div class="linkedin">Post</div>
```
* **url** - url to share.

[Linkedin Open Graph protocol documentation](https://www.linkedin.com/help/linkedin/answer/46687/making-your-website-shareable-on-linkedin).

### OK (Odnoklassniki)
```html
<div class="odnoklassniki" data-imageurl="http://i.imgur.com/zunNbfY.jpg">Like</div>
```
* **url** - url to share.
* **title** - text which is used as a title of created post.
* **imageurl** - url to a picture which is used as a thumbnail for the post.
* **counter** - if provided, blocks the API call and simply shows given value instead.

[OK Open Graph protocol documentation](https://apiok.ru/en/ext/like).

### Pinterest
```html
<div class="pinterest" data-media="https://placekitten.com/200/400">Pin</div>
```
* **url** - url to share.
* **title** - text which is used as a comment to created pin.
* **media** - URL of an image that overrides the image in the Pin Create form.
If not provided, Pinterest will try to find image at the given webpage.
Use the this attribute to provide a better-quality version of the image if you have one.
* **counter** - if provided, blocks the API call and simply shows given value instead.

[Pinterest Open Graph protocol documentation](https://developers.pinterest.com/docs/rich-pins/overview/).

### Reddit
```html
<div class="reddit">Submit</div>
```
Reddit counter is calculated as a sum score of the 5 most up-voted posts for a given link, across all sub-reddits.
* **url** - url to share.
* **title** - title of the post, defaults to the page title.
* **counter** - if provided, blocks the API call and simply shows given value instead.

[Reddit Open Graph protocol documentation](https://github.com/reddit-archive/reddit/blob/master/r2/r2/lib/media.py#L725).

### Telegram
```html
<div class="telegram" data-title="Check this link above!">Send</div>
```
* **url** - url to share.
* **title** - text that appears after the link in the shared message, defaults to the page title.

[Telegram Open Graph protocol documentation](https://stackoverflow.com/questions/30160294).

### Twitter
```html
<div class="twitter" data-via="ilyabirman" data-hashtags="kittens,puppies">Tweet</div>
```
* **url** - url to share.
* **title** - comment that appears before the shared url.
* **via** - indicates a specific user a source of the information.
Adds a clickable username to the tweet, like so: `My page: https://google.com/ via @ilyabirman`
* **hashtags** - a comma-separated list of hashtags added to the tweet. Omit a preceding “#” from each hashtag.

[Twitter Open Graph protocol documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started).

### Viber
```html
<div class="viber">Send</div>
```
* **url** - url to share.
* **title** - text that appears on a separate line after the shared url.
⚠ Viber share messages are not editable in the client application,
so if you don't wan't the title to appear, please set empty `data-title=""` attribute on the Viber button.

[Viber Open Graph protocol documentation](https://stackoverflow.com/questions/34941283)

### VK
```html
<div class="vkontakte" data-image="https://placekitten.com/200/400" data-comment="Check this out">Share</div>
```
* **url** - url to share.
* **title** - text used as the preview header
* **image** - url for image used as the preview thumbnail
* **comment** - default post text that the user can edit.
* **counter** - if provided, blocks the API call and simply shows given value instead.

[VK Open Graph protocol documentation](https://vk.com/dev/widget_share) (switch to Russian language, English docs are incomplete).

### Whatsapp
```html
<div class="whatsapp">Send</div>
```
* **url** - url to share
* **title** - text that precedes the link in the shared message, defaults to the page title.

[Whatsapp Open Graph protocol documentation](https://stackoverflow.com/questions/19778620).

## Additional info
### Reinitialize configuration on change data attributes
If you need to dynamically change the widget's configuration, you can re-initialize it:

```javascript
// Use global object, created by the library
likely.initiate();
// If you need to refresh the counters, pass the corresponding param,
// but be aware that it will issue xhr calls to all the relevant services.
likely.initiate({forceUpdate: true});
```

### How to disable the automatic counters
Counters are enabled by default, but there are two ways to disable them:
* To add `data-counters` attribute on the upper `likely` div with `"no"`value to disable all counters.
* Another option is to supply a custom value for `data-counter` attribute of the specific services.
Likely won't do an API request for those services and just display the given value instead.
It can be used when you want to save user's traffic and obtain value through some other means,
for example through the backend in a centralized manner.

### Accessibility Settings
To make buttons accessible for keyboard navigation and screen readers add `tabindex`, `role` and `aria-label` attributes:
```html
<div class="likely">
    <div class="facebook" tabindex="0" role="link" aria-label="Share on Facebook">Share</div>
    <div class="twitter" tabindex="0" role="link" aria-label="Tweet on Twitter">Tweet</div>
    <!-- The same for each services -->
</div>
```

### Custom button
It's possible to add a custom button into Likely's row of buttons.
Let's assume that you have a 16x16 pixels image and a link to the service which you want to share to.
```html
<div class="likely__widget">
    <!-- List of other services -->
    <a class="likely__button" style="color:black" href="https://new.service.share.url">
        <img class="likely__icon" alt="" src="https://url.of/the/image/16x16.png">
        Post
    </a>
</div>
```

### Supported browsers
We support IE 10+, Safari 9+ and the latest versions of Chrome, Firefox and Edge. Likely might work in the older versions too but we don’t maintain the compatibility on purpose.

### Deprecations
In version 3.0 the following is going to be changed:
1. Classes `likely-visible` and `likely-ready` will be merged into just `likely-ready`, so please don't rely on `likely-visible` to test the presence.
2. Unrecognized params passed to the services will be ignored.
3. Old initialization method will be removed.
4. Likely buttons will be changed from <div> to <button> tag.

As of now, there are deprecation warnings implemented for all the above.

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
