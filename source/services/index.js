/**
 * Social network services
 */

var Service = require('../service'),
    utils   = require('../utils'),
    svg     = require('../svg.json');

var services = {
    odnoklassniki: require('./odnoklassniki'),
    vkontakte:     require('./vk'),
    pinterest:     require('./pinterest'),
    facebook:      require('./facebook'),
    twitter:       require('./twitter'),
    gplus:         require('./gplus'),
    linkedin:      require('./linkedin')
};

utils.each(services, function (service, key) {
    Service(service);
    
    service.svgi = svg[key];
    service.name = key;
});

module.exports = services;