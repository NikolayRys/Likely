import facebook from './facebook';
import initService from '../init_service';
import linkedin from './linkedin';
import pinterest from './pinterest';
import reddit from './reddit';
import telegram from './telegram';
import threads from './threads';
import viber from './viber';
import whatsapp from './whatsapp';
import xcom from './xcom';

const services = {
    facebook,
    linkedin,
    pinterest,
    reddit,
    telegram,
    threads,
    viber,
    whatsapp,
    xcom,
    x: xcom,
};

Object.values(services).forEach((serviceObj) => initService(serviceObj));

export default services;
