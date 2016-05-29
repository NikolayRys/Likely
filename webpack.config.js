'use strict';

var webpack = require('webpack');

module.exports = {
    entry: {
        likely: './source/likely.js',
        // [] is a workaround, see https://github.com/webpack/webpack/issues/300
        'likely-commonjs': ['./source/index.js'],
    },
    output: {
        filename: '[name].js',
        library: 'likely',
        libraryTarget: 'umd',
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                // eslint-disable-next-line camelcase
                screw_ie8: true,
            },
        }),
    ],
};
