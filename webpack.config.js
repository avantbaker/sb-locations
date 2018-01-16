const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        single: "./src/js/entries/single.js",
        all: "./src/js/entries/all.js",
        main: "./src/js/entries/main.js",
        details: "./src/js/entries/details.js",
        headline: "./src/js/entries/headline.js",
        sidebar: "./src/js/entries/sidebar.js",
        slice: "./src/js/entries/slicenation.js"
    },
    output: {
        path: './',
        filename: 'location-[name].min.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src/js')
            },
            {
                test: /\.scss/,
                loaders: [
                    'style',
                    'css',
                    'sass?sourceMap'
                ],
                include: path.join(__dirname, 'src/scss')
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192',
                include: path.join(__dirname, 'src')
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
