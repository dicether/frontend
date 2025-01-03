const webpack = require("webpack");
const {merge} = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const common = require("./common");
const config = require("./config");

module.exports = merge(common, {
    mode: "production",
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: "assets/robots.txt", to: "../robots.txt"},
                {from: "headers", to: "../"},
                {from: "assets/site.webmanifest", to: "../site.webmanifest"},
                {from: "assets/favicon.ico", to: "../favicon.ico"},
            ],
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("staging"),
                SENTRY_LOGGING: true,
                REDUX_LOGGING: true,
                CONTRACT_ADDRESS: JSON.stringify(config.contractAddress),
                SERVER_ADDRESS: JSON.stringify(config.serverAddress),
                API_URL: JSON.stringify(config.apiUrl),
                SOCKET_URL: JSON.stringify(config.websocketUrl),
                CHAIN_ID: JSON.stringify(config.chainId),
                VERSION: JSON.stringify(config.version),
            },
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
        }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    sourceMap: true,
                },
            }),
        ],
    },
});
