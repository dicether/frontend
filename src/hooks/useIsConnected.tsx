import {useConnection} from "wagmi";

import {validChainId} from "../platform/modules/games/state/asyncActions";

export const useIsConnected = (): boolean => {
    const connection = useConnection();
    return connection.isConnected && connection.chainId !== undefined && validChainId(connection.chainId);
};
