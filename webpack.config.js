const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        libs:['./src/js/mobile-base.js', './src/js/jquery_1_8_3.js'],
        index: ['./src/js/css.js', './src/js/index.js'],
    },
    // sourcemap功能
    devtool: 'inline-source-map',
    // 将库的对象挂靠在全局对象中，
    // 通过另外一个对象存储对象名以及映射到对应模块名的变量，
    // 直接在html模版里使用库的CDN文件
    // 从输出的 bundle 中排除依赖
    // 需要 在html的模板里，引用相应cdn的路径
    // <script src="https:..unpkg.com/...jqury"></script>
    externals: {
        "jquery": "window.jQuery",
        "$": "window.jQuery",
        "jQuery": "window.jQuery"
    },
    devServer: {
        contentBase: './dist'
    },
    plugins:[
        // 清空dist目录
        new CleanWebpackPlugin([__dirname + '/dist']),
        // HtmlWebpackPlugin 默认会生成一个index.html，即使本来已经存在
        // 会把所有..bundle.js都自动 添加 到生成的index.html里
        new HtmlWebPackPlugin({
            filename: __dirname + '/dist/index.html',
            template: __dirname + '/src/index.html',
            inject:'body',
            hash: true,
            // 指定 chunks的顺序
            chunksSortMode: 'manual',
             // 这个模板对应上面那个节点
            chunks: [ "libs",'index']
        }),

        // css抽取
        // contenthash是内容是
        // 因webpack是把CSS打包在js里的，所以contenthash，只适合于css
        new extractTextPlugin("index.[contenthash].css"),


    ],
    module:{
        rules: [
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.html$/,
                use:[
                    'html-loader'
                ]
            }
        ]
    },
    output: {
        // 有几个entry , 就会有几个output里的js
        /* 这里有几个值： hash:  the hash of the module identifier
                                    chunkhash: the hash of the chunk content
                                    name: the module name
                                    id: the module identifiler
                                    query: the modlue query, eg: the string following ? in the filename
        */
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        // chunkFilename: "[name].bundle.js",
    }
  };

