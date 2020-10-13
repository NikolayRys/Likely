/**
 * Reddit service provider
 * Share doc: https://www.reddit.com/dev/api#POST_api_submit + https://stackoverflow.com/a/32533431
 * Counter doc: https://www.reddit.com/dev/api/#GET_search
 * Scores are in `child.data.score` and are number of up-votes minus number of down-votes for an URL submitted to Reddit
 * Displayed counter is calculated as sum of counts for the 5 most upvoted posts for this url.
 */
export default {
    counterUrl: 'https://www.reddit.com/search.json?q=url:{url}&sort=top&type=link&limit=5',
    convertNumber: (response) => {
        const parsedResponse = JSON.parse(response);
        let totalUpvotes = 0;
        parsedResponse.data.children.forEach((child) => {
            if (child.data && child.data.score) {
                totalUpvotes += child.data.score;
            }
        });
        return totalUpvotes;
    },
    popupUrl: 'https://reddit.com/submit?url={url}&title={title}',
    popupWidth: 785,
    popupHeight: 550,
    knownParams: ['url', 'title', 'counter'],
    svgIconPath: '15.936,7.186 C15.936,6.227 15.159,5.450 14.200,5.450 C13.732,5.450 13.308,5.636 12.995,5.937 C11.808,5.080 10.173,4.527 8.352,4.464 L9.143,0.742 L11.727,1.291 C11.758,1.949 12.296,2.473 12.961,2.473 C13.646,2.473 14.202,1.918 14.202,1.233 C14.202,0.548 13.646,-0.008 12.961,-0.008 C12.474,-0.008 12.057,0.276 11.854,0.685 L8.968,0.071 C8.888,0.054 8.804,0.069 8.735,0.114 C8.666,0.159 8.617,0.230 8.600,0.310 L7.717,4.462 C5.869,4.514 4.207,5.068 3.005,5.934 C2.693,5.634 2.271,5.450 1.804,5.450 C0.845,5.450 0.068,6.227 0.068,7.186 C0.068,7.892 0.489,8.498 1.094,8.769 C1.067,8.942 1.052,9.117 1.052,9.295 C1.052,11.966 4.162,14.132 7.998,14.132 C11.834,14.132 14.944,11.966 14.944,9.295 C14.944,9.118 14.929,8.944 14.903,8.773 C15.511,8.503 15.936,7.894 15.936,7.186 ZM4.031,8.427 C4.031,7.743 4.588,7.186 5.272,7.186 C5.955,7.186 6.512,7.743 6.512,8.427 C6.512,9.110 5.955,9.667 5.272,9.667 C4.588,9.667 4.031,9.110 4.031,8.427 ZM10.947,11.704 C10.101,12.549 8.478,12.615 8.001,12.615 C7.524,12.615 5.902,12.549 5.057,11.704 C4.931,11.578 4.931,11.375 5.057,11.249 C5.182,11.124 5.386,11.124 5.511,11.249 C6.045,11.783 7.186,11.972 8.001,11.972 C8.817,11.972 9.958,11.783 10.493,11.249 C10.619,11.124 10.822,11.124 10.947,11.249 C11.073,11.375 11.073,11.578 10.947,11.704 ZM10.729,9.667 C10.045,9.667 9.488,9.110 9.488,8.427 C9.488,7.743 10.045,7.186 10.729,7.186 C11.413,7.186 11.969,7.743 11.969,8.427 C11.969,9.110 11.413,9.667 10.729,9.667',
};
