var webpack = require ('webpack')

module.exports = {
    entry: './source/likely.js',
    output: {
        filename: 'likely.js',
        library: 'likely',
        libraryTarget: 'umd',
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                screw_ie8: true,
            },
        }),
    ],
};
