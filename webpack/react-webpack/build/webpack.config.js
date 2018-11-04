const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
//这个配置文件是专门用来打包DLL的
module.exports = env => {
    return {
        mode : env.NODE_ENV,//这里要改变成函数
        entry: './src/index.js',
        output: {
            path: path.resolve('dist'),//输出的路径
            filename: 'js/[hash].bundle.js',//输出的文件名
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
                                ["@babel/plugin-syntax-dynamic-import"]
                            ]
                        }
                    }]
                },
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    /**
                     * 1. webpack会去读取模块的内容
                     * 2. 用加载的模块的文件名去配置文件里找rules
                     * 3. 如果匹配上了则会找对应的loader进行处理
                     * 4. 
                     */
                    //loader的执行是从右向左执行
                    //css-loader是用来处理样式中的import url语句的
                    //style-loader会生成一个js脚本，把CSS样式作为style标签插入到页面中
                    //miniCssExtractPlugin.loader会收集所有的css样式
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
                },
                {
                    test: /\.(png|jpg|gif|svg|eot|woff|ttf)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            //输出的目录 ,会放到dist的image目录里
                            outputPath: 'images',
                            //在HTML中的访问路径
                            publicPath: '/images',
                            limit: 1
                        }
                    }]
                }
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
             //此插件会把收集到的CSS样式保存到一个文件里去，并且把文件链接插入html里
            new MiniCssExtractPlugin({
                filename: 'css/[name].[hash:8].css',
            }),
            //此插件的用途 当我的源码代在引入一个模块的时候，比如react模块。
            //会先去react.manifest.json找一找，有没有对应的模块,如果找不到了，则不再打包
            new DllReferencePlugin({
                manifest: path.resolve(__dirname, '../dist', 'react.manifest.json')
            }),
            // 在htmlwebpack后插入一个AddAssetHtmlPlugin插件，用于将vendor插入打包后的页面
            new AddAssetHtmlPlugin({ filepath: require.resolve('../dist/react.dll.js'), includeSourcemap: false })
        ]
    };
}