'use strict';

const LikelyPage = {
    AUTOINIT: 'autoinit.html',
    NO_AUTOINIT: 'no-autoinit.html',
    NO_AUTOINIT_WRAPPED: 'no-autoinit-wrapped.html',
    ISSUE_67: 'issues/67.html',
};

function getLikelyPage(driver, pageName) {
    return driver.get('http://127.0.0.1:1337/test/files/' + pageName);
}

exports.getLikelyPage = getLikelyPage;
exports.LikelyPage = LikelyPage;
