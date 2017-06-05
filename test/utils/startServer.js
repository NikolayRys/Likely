'use strict';

const StaticServer = require('static-server');

function startServer() {
    new StaticServer({
        rootPath: `${__dirname}/../..`,
        port: 1337,
        host: '127.0.0.1',
    }).start();
}

module.exports = startServer;
