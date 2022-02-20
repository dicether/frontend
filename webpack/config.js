const {GitRevisionPlugin} = require("git-revision-webpack-plugin");

const domain = "dicether.com";

module.exports = {
    domain: domain,
    contractAddress: "0x0F2f2aB5924B977E9c52B83032dB49941c67CD8e",
    serverAddress: "0xcef260a5fed7a896bbe07b933b3a5c17aec094d8",
    apiUrl: `https://api.${domain}/api`,
    websocketUrl: `https://websocket.${domain}`,
    chainId: 1,
    version: new GitRevisionPlugin().commithash(),
};
