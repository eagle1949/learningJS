const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');
//这个配置文件是专门用来打包DLL的
module.exports = {
    mode : 'production',
    entry: {
        react: ['react', 'react-dom', 'axios', 'react-router-dom']
    },
    output: {
        path: path.resolve('./dist'),//输出的路径
        filename: '[name].dll.js',//输出的文件名
        //var _dll_react = xxx
        library: '_dll_[name]',//输出的全局变量名
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
        new DllPlugin({
            name: '_dll_[name]',
            path: path.resolve(__dirname, '../dist', '[name].manifest.json')
        })
    ]
}