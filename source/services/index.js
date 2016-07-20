/**
 * Social network services
 */
import Service from '../service';

import facebook from './facebook';
import gplus from './gplus';
import odnoklassniki from './odnoklassniki';
import pinterest from './pinterest';

import svg from '../svg.js';

import telegram from './telegram';
import twitter from './twitter';

import utils from '../utils';

import vkontakte from './vk';


/* eslint-disable global-require */
var services = {
    odnoklassniki,
    vkontakte,
    pinterest,
    facebook,
    twitter,
    gplus,
    telegram,
};
/* eslint-enable global-require */

utils.each(services, (service, key) => {
    Service(service);

    service.svgi = svg[key];
    service.name = key;
});

export default services;
