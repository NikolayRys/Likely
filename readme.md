# Likely

> The social sharing buttons that aren’t shabby

![Likely screenshot](http://i.imgur.com/KvMkD6R.png)

## Install

Install with npm:

```sh
$ npm install ilyabirman-likely --save
```

Install with bower:

```sh
$ bower install ilyabirman-likely --save
```

Or [download the repository code](https://github.com/ilyabirman/Likely/archive/master.zip) and move `release/likely.js` and 
`release/likely.css` to the desired directory.

## Setup

First, include the compiled sources.

With npm:

```html
<!-- Head -->
<link href="node_modules/ilyabirman-likely/release/likely.css" 
      rel="stylesheet">
<!-- End of body -->
<script src="node_modules/ilyabirman-likely/release/likely.js" 
        type="text/javascript"></script>
```

With bower:

```html
<!-- Head -->
<link href="bower_components/Likely/release/likely.css" 
      rel="stylesheet">
<!-- End of body -->
<script src="bower_components/Likely/release/likely.js" 
        type="text/javascript"></script>
```

Or, if you downloaded the repository code, just include the files called `likely.css` and `likely.js`.

Then, create a `div` with the `likely` class and list necessary social networks in child `div`s:

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

If you need several Likely widgets on the page, just create another `div` with the `likely` class and list the social networks in it.

### Usage with webpack

First, install webpack’s [`json-loader`](https://github.com/webpack/json-loader) and add it to your `webpack.config.js`:

```sh
$ npm install json-loader --save-dev
```

```js
// webpack.config.js
module.exports = {
    module: {
        loaders: [
            { test: /\.json/, loader: 'json-loader' }
        ]
    }
}
```

Then, install `likely` with npm:

```sh
$ npm install likely --save
```

Then, initiate Likely:

```js
var likely = require('ilyabirman-likely');

likely.initiate();
```

This will find all Likely widgets in the document and initialize them.

_Thanks to [Corey Maler](https://github.com/Corey-Maler) for the instructions._

## Options

You can configure Likely by specifying `data-*` attributes on a button group or on a button.

### Common options

These options should be specified on the `div` with the `likely` class.

* `data-url` – URL to share and load counters for
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

### Pinterest

You can set `data-media` attribute to override a default image and substitute a different one in the Pin Create form.
The attribute should be an image URL:

```html
<div class="pinterest" data-media="https://placekitten.com/200/400">Pin</div>
```

Read more about the `media` parameter in the [in the Pinterest documentation](https://developers.pinterest.com/docs/widgets/pin-it/#source-settings).

## Supported browsers

We support IE 10+, Safari 9+ and the latest versions of Chrome, Firefox and Edge. Likely could work in the older versions too, but we don’t do anything specific to maintain its compatibility with them and don’t test it there. 

## Demo

You can see Likely in action on its [homepage](http://ilyabirman.net/projects/likely/).
