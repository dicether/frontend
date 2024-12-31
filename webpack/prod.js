const webpack = require("webpack");
const {merge} = require("webpack-merge");
const SitemapPlugin = require("sitemap-webpack-plugin").default;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const common = require("./common");
const config = require("./config");

const Paths = [
    "/",
    "/games/dice",
    "/games/chooseFrom12",
    "/games/flipACoin",
    "/games/keno",
    "/games/wheel",
    "/games/plinko",
    "/faq",
    "/hallOfFame/weekly",
    "/hallOfFame/monthly",
    "/hallOfFame/all",
];

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
                NODE_ENV: JSON.stringify("production"),
                SENTRY_LOGGING: true,
                REDUX_LOGGING: false,
                CONTRACT_ADDRESS: JSON.stringify(config.contractAddress),
                SERVER_ADDRESS: JSON.stringify(config.serverAddress),
                API_URL: JSON.stringify(config.apiUrl),
                SOCKET_URL: JSON.stringify(config.websocketUrl),
                CHAIN_ID: JSON.stringify(config.chainId),
                VERSION: JSON.stringify(config.version),
                BUILD_DATE: JSON.stringify(new Date().toISOString()),
            },
        }),
        new SitemapPlugin({base: `https://${config.domain}`, paths: Paths, options: {skipGzip: true}}),
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
        }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
    },
});
