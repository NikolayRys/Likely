import history from './history';
import likely from './index.js';

window.addEventListener('load', () => {
    likely.initiate();
    history.init();
});

export default likely;
