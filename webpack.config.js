const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const SitemapPlugin = require('sitemap-webpack-plugin').default;


//plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const json = require("json-loader");

// Environment detection
const node_env = process.env.NODE_ENV || 'development';

// dev server configuration
const publicPath = (process.env.DEV_SERVER === 'TRUE') ? '/' : '/static/';

// Project root
const context = path.join(__dirname, '.');

// src code directory
const contextRoot = path.join(context, 'src');

// build output location
const buildOutputPath = './dist/static';

const Title = "Dicether";

// Dev config
const DevContractAddress = "0x7a1e1ded2fabcfe87af12ee7b8d7303b0e63c303";
const DevServerAddress = "0xa8d5f39f3ccd4795b0e38feacb4f2ee22486ca44";
const DevApiUrl = 'http://localhost:5000/api';
const DevWebsocketUrl = 'http://localhost:5001';
const DevChainId = 123456789;

// Production and staging config
const Domain = 'dicether.com';
const ContractAddress = "0xbF8B9092e809DE87932B28ffaa00D520b04359aA";
const ServerAddress = "0xcef260a5fed7a896bbe07b933b3a5c17aec094d8";
const ApiUrl = `https://api.${Domain}/api`;
const WebsocketUrl = `https://websocket.${Domain}`;
const ChainId = 1;

const Paths = [
    '/',
    '/games/dice',
    '/faq',
    '/hallOfFame/weekly',
    '/hallOfFame/monthly',
    '/hallOfFame/all',
];


// Different resource chunks
const chunks = {
    index: [
        path.join(contextRoot, 'index.tsx'),
        path.join(contextRoot, 'bs-theme-glob.scss'),
    ]
};

// Plugins Config
let plugins = [
	// vendor_js contains all vendor specific packages which
	// are used by multiple pages
	new webpack.optimize.CommonsChunkPlugin({
		name : "vendor",
		minChunks : function(module) {
            return module.context && (module.context.indexOf('node_modules') !== -1 || module.context.indexOf('vendor') !== -1);
	    },
	    chunks: ['index'] // add all chunks from where common vendor should be extracted
	}),

    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
    }),

	new ExtractTextPlugin('[name].[chunkhash].css'),
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
        failOnError: true,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
    })
];

// Production environment only plugins.
if (node_env === 'development') {
    plugins = plugins.concat([
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'SENTRY_LOGGING': false,
                'REDUX_LOGGING': true,
                'CONTRACT_ADDRESS': JSON.stringify(DevContractAddress),
                'SERVER_ADDRESS': JSON.stringify(DevServerAddress),
                "API_URL": JSON.stringify(DevApiUrl),
                'SOCKET_URL': JSON.stringify(DevWebsocketUrl),
                'CHAIN_ID': JSON.stringify(DevChainId)
            }
        })
    ]);
} else if (node_env === 'staging') {
    plugins = plugins.concat([
        new CopyWebpackPlugin([
            {from: 'assets/robots-staging.txt', to: (process.env.DEV_SERVER === 'TRUE') ? './' : '../robots.txt'},
            {from: 'headers', to: (process.env.DEV_SERVER === 'TRUE') ? './' : '../'}
        ]),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('staging'),
                'SENTRY_LOGGING': false,
                'REDUX_LOGGING': true,
                'CONTRACT_ADDRESS': JSON.stringify(ContractAddress),
                'SERVER_ADDRESS': JSON.stringify(ServerAddress),
                'API_URL': JSON.stringify(ApiUrl),
                'SOCKET_URL': JSON.stringify(WebsocketUrl),
                'CHAIN_ID': JSON.stringify(ChainId)
            }
        })
    ]);
} else  if (node_env === 'production') {
    plugins = plugins.concat([
        new CopyWebpackPlugin([
            {from: 'assets/robots.txt', to: (process.env.DEV_SERVER === 'TRUE') ? './' : '../robots.txt'},
            {from: 'headers', to: (process.env.DEV_SERVER === 'TRUE') ? './' : '../'}
        ]),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'SENTRY_LOGGING': true,
                'REDUX_LOGGING': false,
                'CONTRACT_ADDRESS': JSON.stringify(ContractAddress),
                'SERVER_ADDRESS': JSON.stringify(ServerAddress),
                'API_URL': JSON.stringify(ApiUrl),
                'SOCKET_URL': JSON.stringify(WebsocketUrl),
                'CHAIN_ID': JSON.stringify(ChainId)
            }
        }),
        new SitemapPlugin(`https://${Domain}`, Paths, {skipGzip: true}),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
        }),
        new UglifyJsPlugin({
            sourceMap: true
        })
    ]);
}

// the final webpack config
module.exports = {
	entry : chunks,
	output : {
		path :  __dirname + '/' + buildOutputPath,
		publicPath : publicPath,
		filename : '[name].[chunkhash].js',
	},
	resolve : {
		//Allow requiring files without supplying the extension.
		extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
		modules: [path.join(__dirname, 'src'), "node_modules"],
        alias: {
		    assets: path.resolve(__dirname, 'assets')
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { sourceMap: true } },
                        { loader: 'postcss-loader', options: { sourceMap: true } }
                    ]
                })
            },
            {
                test: /glob\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader', options: {
                                sourceMap: true,
                                modules: false,
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
                })
            },
            {
                test: /\.scss$/,
                exclude: /glob\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader', options: {
                                sourceMap: true,
                                modules: true,
                                localIdentName: '[hash:base64:5]__[local]',
                                importLoaders: 1,
                                getLocalIdent: (context, localIdentName, localName, options) => {
                                    const request = path.relative(__dirname, context.resourcePath);
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
                })
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
                    options: {
                        presets: [
                            ['env', {
                                useBuiltIns: true,
                                targets: {
                                    browsers: ['>1%', 'last 2 versions'],
                                },
                                debug: true
                            }],
                            'react',
                            'flow'],
                        plugins: ['babel-plugin-transform-object-rest-spread', 'transform-class-properties']
                    }
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['env', {
                                    useBuiltIns: true,
                                    targets: {
                                        browsers: ['>1%', 'last 2 versions'],
                                    },
                                    debug: true
                                }],
                                'react',
                                'flow'],
                            plugins: ['babel-plugin-transform-object-rest-spread', 'transform-class-properties']
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
        ]
    },
	plugins : plugins,
};
