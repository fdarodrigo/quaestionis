const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './background.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.API_KEY': "AIzaSyC7cTMms4nwPwIusJJa32mJbcFyMWz9gwc"
        })
    ]
};
