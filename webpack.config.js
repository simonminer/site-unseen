const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        clean: true,
        filename: 'site-unseen.[hash:8].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new FaviconsWebpackPlugin({
            logo: './src/assets/images/site-unseen-logo.png',
            mode: 'webapp',
            devMode: 'light',
            outputPath: './assets/images/',
            prefix: 'assets/images/'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(gif|png|jpe?g)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        static: './src',
        open: true
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};
