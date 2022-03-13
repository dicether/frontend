const {GitRevisionPlugin} = require("git-revision-webpack-plugin");

const domain = "dicether.com";

module.exports = {
    domain: domain,
    contractAddress: "0xa867bF8447eC6f614EA996057e3D769b76a8aa0e",
    serverAddress: "0x437EC7503dFF1b5F5Ab4Dab4455C45a270629f4d",
    apiUrl: `https://api.${domain}/api`,
    websocketUrl: `https://websocket.${domain}`,
    chainId: 1,
    version: new GitRevisionPlugin().commithash(),
};
