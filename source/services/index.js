/**
 * Social network services
 */
import Service from '../service';
import svg from '../svg.js';
import utils from '../utils';
import vkontakte from './vk';

import facebook from './facebook'; // eslint-disable-line sort-imports
import gplus from './gplus';
import odnoklassniki from './odnoklassniki';
import pinterest from './pinterest';
import telegram from './telegram';
import twitter from './twitter';

const services = {
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
