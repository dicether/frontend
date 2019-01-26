const crypto = require('crypto');
const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');


// Project root
const context = path.join(process.cwd(), '.');

// src code directory
const contextRoot = path.join(context, 'src');


const Title = "Dicether";


// the final webpack config
module.exports = {
	entry : {
        index: [
            path.join(contextRoot, 'index.tsx'),
            path.join(contextRoot, 'bs-theme-glob.scss'),
        ]
    },
	output : {
		path :  context  + '/dist/static',
		publicPath : (process.env.DEV_SERVER === 'TRUE') ? '/' : '/static/',
		filename : '[name].[chunkhash].js',
	},
	resolve : {
		//Allow requiring files without supplying the extension.
		extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
		modules: [contextRoot, "node_modules"],
        alias: {
		    assets: path.resolve(context, 'assets')
        }
	},
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
    devServer: {
        historyApiFallback: {
            index: '/index.html'
        },
        proxy: {
            historyApiFallback: true,
        }
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } }
                ]
            },
            {
                test: /(glob\.scss|reusable\/\w+\.scss)$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader', options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '',
                            getLocalIdent: (context, localIdentName, localName, options) => {
                                return localName;
                            }
                        }
                    },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'resolve-url-loader', options: { sourceMap: true } },
                    {
                        loader: 'sass-loader', options: {
                            sourceMap: true,
                            includePath: [path.join(__dirname, 'src')]
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: /(glob\.scss|reusable\/\w+\.scss)$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader', options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[hash:base64:5]__[local]',
                            importLoaders: 1,
                            getLocalIdent: (context, localIdentName, localName, options) => {
                                const request = path.relative(contextRoot, context.resourcePath);
                                const sha = crypto.createHash('sha1');
                                sha.update(request);
                                const prefix = sha.digest('base64').slice(0, 5);
                                const hash =  prefix + '__' +  localName;
                                return hash.replace(new RegExp("[^a-zA-Z0-9\\-_\u00A0-\uFFFF]", "g"), "-").replace(/^((-?[0-9])|--)/, "_$1");
                            }
                        }
                    },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'resolve-url-loader', options: { sourceMap: true } },
                    {
                        loader: 'sass-loader', options: {
                            sourceMap: true,
                            includePath: [path.join(__dirname, 'src')]
                        }
                    }
                ]
            },

            {
                test: /\.(png|jpg|gif|ico)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }]
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
                // loader: "url?limit=10000"
                use: "url-loader"
            },
            {
                test: /\.(ttf|eot|svg|wav)(\?[\s\S]+)?$/,
                use: 'file-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
        ]
    },
	plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css'
        }),
        new HtmlWebpackPlugin({
            title: Title,
            filename: (process.env.DEV_SERVER === 'TRUE') ? 'index.html' : '../index.html',
            template: 'root.ejs',
            favicon: 'assets/images/favicon.png',
            inject: 'body'
        }),
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /a\.js|node_modules/,
            // add errors to webpack instead of warnings
            failOnError: false,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        })
    ]
};
