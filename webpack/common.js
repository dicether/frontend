const crypto = require("crypto");
const path = require("path");

const CircularDependencyPlugin = require("circular-dependency-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {ProvidePlugin} = require("webpack");

// Project root
const context = path.join(process.cwd(), ".");

// src code directory
const contextRoot = path.join(context, "src");

const Title = "Dicether";

const sassOptions = {
    silenceDeprecations: ["import", "global-builtin", "color-functions"],
    includePaths: [path.join(__dirname, "src")],
};

// the final webpack config
module.exports = {
    entry: {
        index: [path.join(contextRoot, "index.tsx"), path.join(contextRoot, "bs-theme-glob.scss")],
    },
    output: {
        path: context + "/dist/static",
        publicPath: process.env.DEV_SERVER === "TRUE" ? "/" : "/static/",
        filename: "[name].[chunkhash].js",
    },
    resolve: {
        //Allow requiring files without supplying the extension.
        extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
        modules: [contextRoot, "node_modules"],
        alias: {
            assets: path.resolve(context, "assets"),
        },
        fallback: {
            assert: require.resolve("assert/"),
            os: require.resolve("os-browserify/browser"),
            http: require.resolve("stream-http"),
            https: require.resolve("https-browserify"),
            stream: require.resolve("stream-browserify"),
            crypto: require.resolve("crypto-browserify"),
            url: require.resolve("url/"),
            "process/browser": require.resolve("process/browser"),
        },
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all",
                },
            },
        },
    },
    devServer: {
        historyApiFallback: {
            index: "/index.html",
        },
        proxy: [
            {
                historyApiFallback: true,
            },
        ],
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                    {loader: "css-loader", options: {sourceMap: true}},
                    {loader: "postcss-loader", options: {sourceMap: true}},
                ],
            },
            {
                test: /(glob\.scss|reusable\/\w+\.scss)$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            modules: {
                                localIdentName: "[local]",
                                getLocalIdent: (context, localIdentName, localName) => {
                                    return localName;
                                },
                            },
                        },
                    },
                    {loader: "postcss-loader", options: {sourceMap: true}},
                    {loader: "resolve-url-loader", options: {sourceMap: true, root: context, debug: true}},
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            sassOptions,
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                exclude: /(glob\.scss|reusable\/\w+\.scss)$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            modules: {
                                localIdentName: "[hash:base64:5]__[local]",
                                getLocalIdent: (context, localIdentName, localName) => {
                                    const request = path.relative(contextRoot, context.resourcePath);
                                    const sha = crypto.createHash("sha1");
                                    sha.update(request);
                                    const prefix = sha.digest("base64").slice(0, 5);
                                    const hash = prefix + "__" + localName;
                                    return hash
                                        .replace(new RegExp("[^a-zA-Z0-9\\-_\u00A0-\uFFFF]", "g"), "-")
                                        .replace(/^((-?[0-9])|--)/, "_$1");
                                },
                            },
                        },
                    },
                    {loader: "postcss-loader", options: {sourceMap: true}},
                    {loader: "resolve-url-loader", options: {sourceMap: true, root: context, debug: true}},
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            sassOptions,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: [{loader: "babel-loader"}, {loader: "@svgr/webpack"}],
                include: /inline/,
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                resourceQuery: {not: /resource/},
                type: "asset",
                exclude: /inline/,
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                resourceQuery: /resource/, // assets with resource query are not inlined
                generator: {
                    filename: "[hash][ext]", // remove query
                },
                type: "asset/resource",
                exclude: /inline/,
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
                // loader: "url?limit=10000"
                type: "asset/inline",
            },
            {
                test: /\.(ttf|eot|wav)(\?[\s\S]+)?$/,
                type: "asset/resource",
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
        }),
        new HtmlWebpackPlugin({
            title: Title,
            filename: process.env.DEV_SERVER === "TRUE" ? "index.html" : "../index.html",
            template: "root.ejs",
            inject: "body",
        }),
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /a\.js|node_modules/,
            // add errors to webpack instead of warnings
            failOnError: false,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        }),
    ],
};
