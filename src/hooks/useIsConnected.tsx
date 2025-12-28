import {useSelector} from "react-redux";

import {validChainId} from "../platform/modules/games/state/asyncActions";
import {State} from "../rootReducer";

export const useIsConnected = (): boolean => {
    const {web3} = useSelector((state: State) => state);
    return web3.account && web3.contract && web3.web3 && validChainId(web3.chainId);
};
