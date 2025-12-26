import {createConfig, http} from "wagmi";
import {mainnet} from "wagmi/chains";

const wagmiConfig = createConfig({
    chains: [mainnet],
    transports: {
        [mainnet.id]: http(),
    },
});

export default wagmiConfig;
