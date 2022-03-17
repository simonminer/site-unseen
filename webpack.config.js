const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ],
    output: {
        clean: true
    },
    devServer: {
        static: './dist',
        open: true
    }
};
