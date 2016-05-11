'use strict';

/**
 * Social network services
 */

var Service = require('../service');
var utils = require('../utils');
var svg = require('../svg.js');

/* eslint-disable global-require */
var services = {
    odnoklassniki: require('./odnoklassniki'),
    vkontakte: require('./vk'),
    pinterest: require('./pinterest'),
    facebook: require('./facebook'),
    twitter: require('./twitter'),
    gplus: require('./gplus'),
    telegram: require('./telegram'),
};
/* eslint-enable global-require */

utils.each(services, function (service, key) {
    Service(service);

    service.svgi = svg[key];
    service.name = key;
});

module.exports = services;
