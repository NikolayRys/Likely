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

var services = {
    odnoklassniki,
    vkontakte,
    pinterest,
    facebook,
    twitter,
    gplus,
    telegram,
};

utils.each(services, (service, key) => {
    Service(service);

    service.svgi = svg[key];
    service.name = key;
});

export default services;
