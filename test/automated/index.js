/* eslint-env node, mocha, es6 */

'use strict';

const { describe, it } = require('mocha');

describe('Likely', function () {
    describe('common operations', function () {
        it('should initialize properly');
        it('should fetch the counters for Facebook');
        it('should fetch the counters for Google+');
        it('should fetch the counters for Odnoklassniki');
        it('should fetch the counters for Pinterest');
        it('should fetch the counters for VK');
        it('should open the sharing dialog for Facebook');
        it('should open the sharing dialog for Google+');
        it('should open the sharing dialog for Odnoklassniki');
        it('should open the sharing dialog for Pinterest');
        it('should open the sharing dialog for Telegram');
        it('should open the sharing dialog for Twitter');
        it('should open the sharing dialog for VK');
    });

    describe('configuration', function () {
        it('should change the shared URL when `data-url` is specified');
        it('should change the shared title when `data-title` is specified');
        it('should set the `via` when `data-via` on the Twitter button is specified');
        it('should set the shared text when `data-text` on the Telegram button is specified');
        it('should change the default image when the `data-media` on the Pinterest button is specified');
    });

    describe('history', function () {
        it('should change the shared URL when URL hash is changed');
        it('should change the shared URL when history.pushState() is called');
        it('should change the shared URL when history.replaceState() is called');
    });
});
