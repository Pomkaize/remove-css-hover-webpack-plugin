const path = require('path');

const RemoveCssHoverWebpackPlugin = require('../lib/plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'output.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ],
    },
    plugins: [
        new RemoveCssHoverWebpackPlugin({ rulesToRemove: [ /\.(Test|Link)_hover/ ], prefix: 'mobile' }),
        new MiniCssExtractPlugin(),
    ]
};
