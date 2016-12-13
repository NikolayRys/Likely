/**
 * Social network services
 */
import Service from '../service';
import { each } from '../utils';
import svg from '../svg.js';

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

each(services, (service, key) => {
    Service(service);

    service.svgi = svg[key];
    service.name = key;
});

export default services;
