const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Copy .env.example to .env, set your key, and run npm run build again.');
}

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
            'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || '')
        })
    ]
};
