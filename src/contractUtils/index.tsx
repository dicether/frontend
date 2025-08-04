import {Web3} from "web3";

import {MAX_BLOCKS_QUERY} from "../config/config";
import {BigIntMath} from "../util/math";

export function getLastGameId(
    web3: Web3,
    contract: any,
    serverEndHash: string,
    transactionHash: string,
): Promise<number> {
    if (contract == null) {
        return Promise.reject("Error invalid web3 state!");
    }

    return web3.eth
        .getBlockNumber()
        .then((blockNum) => {
            return contract.getPastEvents("LogGameCreated", {
                filter: {serverEndHash},
                fromBlock: BigIntMath.max(blockNum - BigInt(MAX_BLOCKS_QUERY), 0n),
                toBlock: "latest",
            });
        })
        .then((events) => {
            const len = events.length;
            if (len === 0 || events[len - 1].transactionHash !== transactionHash) {
                return Promise.reject(new Error("Could not find event!"));
            }

            return events[len - 1].returnValues.gameId;
        });
}

export async function getLogGameCreated(web3: Web3, contract: any, serverEndHash: string) {
    const blockNum = await web3.eth.getBlockNumber();
    const events = await contract.getPastEvents("LogGameCreated", {
        filter: {serverEndHash},
        fromBlock: BigIntMath.max(blockNum - BigInt(MAX_BLOCKS_QUERY), 0n),
        toBlock: "latest",
    });

    if (events.length !== 1) {
        return undefined;
    }

    return events[0];
}

export function getReasonEnded(web3: Web3, contract: any, gameId: number) {
    return web3.eth
        .getBlockNumber()
        .then((blockNum) => {
            return contract.getPastEvents("LogGameEnded", {
                filter: {gameId},
                fromBlock: BigIntMath.max(blockNum - BigInt(MAX_BLOCKS_QUERY), 0n),
                toBlock: "latest",
            });
        })
        .then((events) => {
            const len = events.length;
            if (len !== 1) {
                return Promise.reject(new Error("Could not find event!"));
            }

            return events[0].returnValues.reasonEnded;
        });
}
