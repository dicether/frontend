import {defineChain} from "viem";
import {createConfig, http} from "wagmi";
import {mainnet} from "wagmi/chains";
import {injected} from "wagmi/connectors";

import {CHAIN_ID} from "./config";

export const localhost = defineChain({
    id: 123456789,
    name: "Localhost",
    nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: {http: ["http://127.0.0.1:8545"]},
    },
});

const chains = CHAIN_ID === 1 ? ([mainnet] as const) : ([localhost] as const);
const transports = {[mainnet.id]: http(), [localhost.id]: http()} as const;

const wagmiConfig = createConfig({
    chains: chains,
    connectors: [injected()],
    transports,
});

export default wagmiConfig;
