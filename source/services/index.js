/**
 * Social network services
 */

var utils = require('../utils'),
    svg   = require('../svg.json');

var services = {
    odnoklassniki: require('./odnoklassniki'),
    vkontakte:     require('./vk'),
    pinterest:     require('./pinterest'),
    facebook:      require('./facebook'),
    twitter:       require('./twitter'),
    gplus:         require('./gplus')
};

utils.each(services, function (_, key) {
    services[key].svgi = svg[key];
});

module.exports = services;