const webpack = require("webpack");
const {merge} = require("webpack-merge");

const common = require("./common");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const serverAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const apiUrl = "http://localhost:5000/api";
const websocketUrl = "http://localhost:5001";
const chainId = 123456789;

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: "assets/robots.txt", to: "robots.txt"},
                {from: "headers", to: "../"},
                {from: "assets/site.webmanifest", to: "site.webmanifest"},
                {from: "assets/favicon.ico", to: "favicon.ico"},
            ],
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development"),
                SENTRY_LOGGING: false,
                REDUX_LOGGING: true,
                CONTRACT_ADDRESS: JSON.stringify(contractAddress),
                SERVER_ADDRESS: JSON.stringify(serverAddress),
                API_URL: JSON.stringify(apiUrl),
                SOCKET_URL: JSON.stringify(websocketUrl),
                CHAIN_ID: JSON.stringify(chainId),
                VERSION: JSON.stringify("dev_server"),
            },
        }),
    ],
});
