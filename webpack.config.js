/* eslint-env node */
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package.json');
const path = require('path');

const license = `Likely $version by Nikolay Rys (linkedin.com/in/nikolay-rys), Ilya Birman (ilyabirman.net), and contributors.
Special thanks to Viktor Karpov (https://twitter.com/vitkarpov), Ivan Akulov (iamakulov.com) and Evgeny Steblinsky (volter9.github.io) and Artem Sapegin (sapegin.me).`;

function getLicenseComment(version) {
    return license.replace(/\$version/g, version);
}

module.exports = (env) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isDom = env.commonjs !== 'true';

    let entry;
    let optimization;

    const connectingLoader = isDom ? MiniCssExtractPlugin.loader : 'style-loader';
    const plugins = [new webpack.BannerPlugin({ banner: getLicenseComment(pkg.version), entryOnly: true })];

    if (isProduction) {
        optimization = { minimizer: [new TerserPlugin({ extractComments: false })] };
        entry = isDom ? { 'likely.min': './source/likely.js' } : { 'likely-commonjs.min': './source/likely-commonjs.js' };
    }
    else {
        entry = isDom ? { likely: './source/likely.js' } : { 'likely-commonjs': './source/likely-commonjs.js' };
    }

    if (isDom) {
        let cssName = 'likely.css';
        if (isProduction) {
            cssName = 'likely.min.css';
            plugins.push(new CssMinimizerPlugin());
        }
        plugins.push(new MiniCssExtractPlugin({ filename: cssName }));
    }

    return {
        entry,
        output: {
            filename: '[name].js',
            library: {
                name: 'likely',
                type: 'umd', // https://webpack.js.org/configuration/output/#librarytarget-umd
            },
            path: path.join(__dirname, '/release'),
            globalObject: 'typeof self !== \'undefined\' ? self : this', // https://github.com/webpack/webpack/issues/6784#issuecomment-375941431
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } },
                },
                {
                    test: /\.styl$/,
                    exclude: /node_modules/,
                    use: [connectingLoader, 'css-loader', 'stylus-loader'],
                },

            ],
        },
        devtool: 'source-map',
        optimization,
        plugins,
    };
};
