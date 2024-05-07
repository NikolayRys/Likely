/**
 * Twitter service provider
 * Doc: https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/parameter-reference1
 * Also mentions "related" param, but it doesn't seem to do any anything in 2020.
 */

export default {
    name: 'xcom',
    popupUrl: 'https://x.com/intent/tweet?url={url}&text={title}',
    popupWidth: 600,
    popupHeight: 450,
    urlCallback() {
        if (!/[.?:\-–—]\s*$/.test(this.options.title)) {
            this.options.title += ':';
        }
    },
    knownParams: ['url', 'title', 'via', 'hashtags'],
    svgIconPath: 'M11.813.721h2.3l-5.025 5.744L15 14.279h-4.629l-3.625-4.74-4.149 4.74H.296l5.375-6.144L0 .721h4.746l3.277 4.333ZM11.006 12.903h1.274L4.054 2.025H2.686z',
};
