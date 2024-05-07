import facebook from './facebook';
import initService from '../init_service';
import linkedin from './linkedin';
import odnoklassniki from './odnoklassniki';
import pinterest from './pinterest';
import reddit from './reddit';
import telegram from './telegram';
import twitter from './twitter';
import viber from './viber';
import vkontakte from './vkontakte';
import whatsapp from './whatsapp';
import xcom from './xcom';

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
    xcom,
    ok: odnoklassniki,
    vk: vkontakte,
    x: xcom,
};

Object.values(services).forEach((serviceObj) => initService(serviceObj));

export default services;
