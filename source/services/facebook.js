/**
 * Facebook service provider
 */

export default {
    counterUrl: 'https://graph.facebook.com/?id={url}&fields=og_object%7Bengagement%7Bcount%7D%%7D&callback=?',
    convertNumber: (data) => data.og_object.engagement.count,
    popupUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
    popupWidth: 600,
    popupHeight: 500,
    svgIconPath: '15.117 0H.883C.395 0 0 .395 0 .883v14.234c0 .488.395.883.883.883h7.663V9.804H6.46V7.39h2.086V5.607c0-2.066 1.262-3.19 3.106-3.19.883 0 1.642.064 1.863.094v2.16h-1.28c-1 0-1.195.48-1.195 1.18v1.54h2.39l-.31 2.42h-2.08V16h4.077c.488 0 .883-.395.883-.883V.883C16 .395 15.605 0 15.117 0',
};
