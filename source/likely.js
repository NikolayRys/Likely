import initHistory from './history';
import likely from './index.js';

window.addEventListener('load', () => {
    likely.initiate();
    initHistory();
});

export default likely;
