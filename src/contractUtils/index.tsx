import {PublicClient} from "viem";

import {MAX_BLOCKS_QUERY} from "../config/config";
import {abi} from "../GameChannelContract";
import {BigIntMath} from "../util/math";

export async function getLastGameId(
    publicClient: PublicClient,
    contractAddress: `0x${string}`,
    serverEndHash: `0x${string}`,
    transactionHash: `0x${string}`,
): Promise<number> {
    const blockNum = await publicClient.getBlockNumber();
    const logs = await publicClient.getContractEvents({
        abi,
        eventName: "LogGameCreated",
        address: contractAddress,
        args: {serverEndHash},
        fromBlock: BigIntMath.max(blockNum - BigInt(MAX_BLOCKS_QUERY), 0n),
        toBlock: "latest",
        strict: false,
    });

    if (logs.length === 0 || logs[logs.length - 1].transactionHash !== transactionHash) {
        return Promise.reject(new Error("Could not find event!"));
    }

    return Number(logs[logs.length - 1].args.gameId);
}

export async function getLogGameCreated(
    publicClient: PublicClient,
    contractAddress: `0x${string}`,
    serverEndHash: `0x${string}`,
): Promise<{serverEndHash: `0x${string}`; gameId: number; userEndHash: `0x${string}`} | undefined> {
    const blockNum = await publicClient.getBlockNumber();
    const events = await publicClient.getContractEvents({
        abi,
        eventName: "LogGameCreated",
        address: contractAddress,
        args: {serverEndHash},
        fromBlock: BigIntMath.max(blockNum - BigInt(MAX_BLOCKS_QUERY), 0n),
        toBlock: "latest",
    });

    if (events.length !== 1) {
        return undefined;
    }

    const args = events[0].args;
    if (args.gameId === undefined || args.userEndHash === undefined || args.serverEndHash === undefined) {
        throw new Error("Malformed event data");
    }

    return {
        serverEndHash: args.serverEndHash,
        gameId: Number(args.gameId),
        userEndHash: args.userEndHash,
    };
}

export async function getReasonEnded(
    publicClient: PublicClient,
    contractAddress: `0x${string}`,
    gameId: number,
): Promise<number> {
    const blockNum = await publicClient.getBlockNumber();

    const logs = await publicClient.getContractEvents({
        abi,
        eventName: "LogGameEnded",
        address: contractAddress,
        args: {gameId: BigInt(gameId)},
        fromBlock: BigIntMath.max(blockNum - BigInt(MAX_BLOCKS_QUERY), 0n),
        toBlock: "latest",
    });

    if (logs.length !== 1) {
        return Promise.reject(new Error("Could not find event!"));
    }

    const reason = logs[0].args.reason;
    if (reason === undefined) {
        return Promise.reject(new Error("Malformed event data"));
    }

    return Number(reason);
}
