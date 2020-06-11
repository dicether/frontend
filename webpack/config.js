const GitRevisionPlugin = require('git-revision-webpack-plugin');

const domain = 'dicether.com';

module.exports = {
    domain: domain,
    contractAddress: "0xaEc1F783B29Aab2727d7C374Aa55483fe299feFa",
    serverAddress: "0xcef260a5fed7a896bbe07b933b3a5c17aec094d8",
    apiUrl: `https://api.${domain}/api`,
    websocketUrl: `https://websocket.${domain}`,
    chainId: 1,
    version: new GitRevisionPlugin().commithash(),
};
