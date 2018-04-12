const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const extractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

const ZipPlugin = require('zip-webpack-plugin');

// webpack ftp上传， 它依赖deploy-kit
const DeployPlugin = require('deploy-kit/plugins/ftp-webpack-plugin')
module.exports = {
    entry: {
        libs:['./src/js/mobile-base.js', './src/js/jquery_1_8_3.js', './src/js/Ecar.dialogPrompt.js', './src/js/Ecar.popWin.js'],
        index: ['./src/js/index.js'],
        // data: ['./src/mock/data.js'],
        // result: './src/js/result.js',

        // vendor: ["babel-polyfill"]
    },
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
        // 拆分插件
        /*new webpack.optimize.CommonsChunkPlugin({
            // name: ["vendor", "runtime"] // 上面入口定义的节点组
            // filename:'libs.[chunkhash].js' //最后生成的文件名
            name: ['libs'],
            filename: 'libs.[chunkhash].js'
        }),*/
        // css抽取
        // contenthash是内容是
        // 因webpack是把CSS打包在js里的，所以contenthash，只适合于css
        new extractTextPlugin("index.[contenthash].css"),

        // 把webpack打包的的文件，进行zip包
        new ZipPlugin({
            // zip包生成的目录
            path: path.resolve(__dirname, 'dist'),
            // zip包的名字
            filename: 'dist.zip',
            fileOptions: {
                mtime: new Date(),
                mode: parseInt("0100664", 8),
                compress: true,
                forceZip64Format: false
            }

        }),

        // ftp 上传
        /*new DeployPlugin({
            server: 'zhangweiming:Pass1234@10.47.59.207:21',
            // deploy all files in the directory
            workspace: __dirname + '/dist',
            // where the files are placed on the server
            deployTo: '/ftpUp',
            /*rules: [
                {
                  test: /zips\/(.*\.zip)$/,
                  dest: 'ftpUp/zips/[$1]'
                }
            ]*/
        // })*/

    ],
    module:{
        rules: [
            {
                test: /\.css$/,
                /*use: [
                    'style-loader',
                    'css-loader'
                ]*/
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


  // http://www.cnblogs.com/ihardcoder/p/5623411.html
  // http://foio.github.io/wepack-code-spliting/
  // https://www.npmjs.com/package/deploy-kit
  // https://github.com/erikdesjardins/zip-webpack-plugin/blob/master/index.js
