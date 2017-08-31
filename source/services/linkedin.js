/**
 * LinkedIn service provider
 */

export default {
    counterUrl: 'https://www.linkedin.com/countserv/count/share?url={url}&format=jsonp&callback=?',
    convertNumber: (data) => data.count,
    popupUrl: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}',
    popupWidth: 600,
    popupHeight: 500,
    svgIconPath: '2.4,6h2.4v7.6H2.4V6z M3.6,2.2c0.8,0,1.4,0.6,1.4,1.4C4.9,4.3,4.3,5,3.6,5C2.8,5,2.2,4.3,2.2,3.6C2.2,2.8,2.8,2.2,3.6,2.2C3.6,2.2,3.6,2.2,3.6,2.2 M6.2,6h2.3v1h0C9,6.2,9.9,5.8,10.8,5.8c2.4,0,2.8,1.6,2.8,3.6v4.2h-2.4V9.9c0-0.9,0-2-1.2-2c-1.2,0-1.4,1-1.4,2v3.8H6.2V6z M13,0H3C1,0,0,1,0,3v10c0,2,1,3,3,3h10c2,0,3-1,3-3V3C16,1,15,0,13,0z',
};
