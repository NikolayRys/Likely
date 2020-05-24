/**
 * Social network services
 */
import Service from '../service';
import { each } from '../utils';

/* eslint-disable sort-imports */
import facebook from './facebook';
import linkedin from './linkedin';
import odnoklassniki from './odnoklassniki';
import pinterest from './pinterest';
import telegram from './telegram';
import twitter from './twitter';
import vkontakte from './vkontakte';
import whatsapp from './whatsapp';
import viber from './viber';
import reddit from './reddit';
/* eslint-enable sort-imports */


const services = {
    facebook,
    linkedin,
    odnoklassniki,
    pinterest,
    telegram,
    twitter,
    vkontakte,
    whatsapp,
    viber,
    reddit,
};

each(services, (service, key) => {
    Service(service);

    service.name = key;
});

export default services;
