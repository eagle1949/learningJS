const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
//这个配置文件是专门用来打包DLL的

module.exports = {
    mode : 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),//输出的路径
        filename: 'bundle.js',//输出的文件名
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    //options=query都是向插件传递参数的
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],
                        ]
                    }
                }]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: true
            }
        }),
        //此插件的用途 当我的源码代在引入一个模块的时候，比如react模块。
        //会先去react.manifest.json找一找，有没有对应的模块,如果找不到了，则不再打包
        new DllReferencePlugin({
            manifest: path.resolve(__dirname, '../dist', 'react.manifest.json')
        })
    ]
}