/**
 * Social network services
 */
import _ from 'lodash';
import { getJSON } from '../dom';

/* eslint-disable sort-imports */
import facebook from './facebook';
import gplus from './gplus';
import linkedin from './linkedin';
import odnoklassniki from './odnoklassniki';
import pinterest from './pinterest';
import telegram from './telegram';
import twitter from './twitter';
import vkontakte from './vk';
/* eslint-enable sort-imports */


const services = {
    facebook,
    gplus,
    linkedin,
    odnoklassniki,
    pinterest,
    telegram,
    twitter,
    vkontakte,
};

const counter = function (/** String*/ url, /** Function*/ factory) {
    getJSON(url, (count) => {
        try {
            const convertedNumber = typeof this.convertNumber === 'function' ? this.convertNumber(count) : count;
            factory(convertedNumber);
        }
        catch (e) {}
    });
};

_.forOwn(services, (service) => {
    // __likelyCounterMock is used for UI testing and is set on window
    // because this function is executed right when Likely is loaded.
    // There’s currently no way to do `likely.__counterMock = ...`
    // before running this method.
    service.counter = window.__likelyCounterMock || service.counter || counter;
    service.click = service.click || (() => true);
});

export default services;
