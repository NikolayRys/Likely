/* eslint-env node */

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageJson = require('./package.json');

const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === 'production';

const license = `Likely $version by Ilya Birman (ilyabirman.net)
Rewritten sans jQuery by Evgeny Steblinsky (volter9.github.io)
Supported by Ivan Akulov (iamakulov.com), Viktor Karpov (vitkarpov.com), 
Nikolay Rys(linkedin.com/in/nikolay-rys) and contributors
Inspired by Social Likes by Artem Sapegin (sapegin.me)`;

function getLicenseComment(version) {
    return license.replace(/\$version/g, version);
}

const plugins = [
    new ExtractTextPlugin({
        filename: './release/likely.css',
        disable: false,
    }),
];

if (isProduction) {
    plugins.push(
        new webpack.BannerPlugin({
            banner: getLicenseComment(packageJson.version),
            exclude: './release/likely.css',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        })
    );
}

module.exports = {
    entry: {
        likely: './source/likely.js',
        // [] is a workaround, see https://github.com/webpack/webpack/issues/300
        'likely-commonjs': ['./source/index.js'],
    },
    output: {
        filename: './release/[name].js',
        library: 'likely',
        libraryTarget: 'umd',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }, {
            test: /\.styl$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract({
                fallbackLoader: 'style-loader',
                loader: 'css-loader!stylus-loader',
            }),
        }],
    },
    devtool: false,
    watch: !isProduction,
    plugins,
};
