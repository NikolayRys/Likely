/* eslint-env node */

const webpack = require('webpack');
const lodashWebpackPlugin = require('lodash-webpack-plugin');
const packageJson = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

function getLicenseComment(version) {
    return [
        'Likely $version by Ilya Birman (ilyabirman.net)',
        'Rewritten sans jQuery by Evgeny Steblinsky (volter9.github.io)',
        'Supported by Ivan Akulov (iamakulov.com), Viktor Karpov (vitkarpov.com), and contributors',
        'Inspired by Social Likes by Artem Sapegin (sapegin.me)',
    ].join('\n').replace(/\$version/g, version);
}

module.exports = {
    entry: {
        likely: './source/index-browser.js',
        // [] is a workaround, see https://github.com/webpack/webpack/issues/300
        'likely-commonjs': ['./source/index-commonjs.js'],
    },
    output: {
        filename: '[name].js',
        library: 'likely',
        libraryTarget: 'umd',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    devtool: 'source-map',
    watch: !isProduction,
    plugins: isProduction ? [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compressor: {
                // eslint-disable-next-line camelcase
                screw_ie8: true,
            },
        }),
        new webpack.BannerPlugin(getLicenseComment(packageJson.version)),
        new lodashWebpackPlugin(),
    ] : [],
};
