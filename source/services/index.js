/**
 * Social network services
 */

var utils = require('../utils'),
    svg   = require('../svg.json');

var Service = require('../service');

var services = {
    odnoklassniki: require('./odnoklassniki'),
    vkontakte:     require('./vk'),
    pinterest:     require('./pinterest'),
    facebook:      require('./facebook'),
    twitter:       require('./twitter'),
    gplus:         require('./gplus')
};

utils.each(services, function (service, key) {
    services[key] = Service(service);
    service.svgi = svg[key];
    service.name = key;
});

module.exports = services;