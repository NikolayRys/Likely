/**
 * Social network services aggregated together
 */
import Service from '../service';

import facebook from './facebook';
import linkedin from './linkedin';
import odnoklassniki from './odnoklassniki';
import pinterest from './pinterest';
import reddit from './reddit';
import telegram from './telegram';
import twitter from './twitter';
import viber from './viber';
import vkontakte from './vkontakte';
import whatsapp from './whatsapp';

const services = {
    facebook,
    linkedin,
    odnoklassniki,
    pinterest,
    reddit,
    telegram,
    twitter,
    viber,
    vkontakte,
    whatsapp,
};

Object.entries(services).forEach((entry) => {
    const [serviceName, serviceObj] = entry;
    Service(serviceObj);
    serviceObj.name = serviceName;
});

export default services;
