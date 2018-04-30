import ethSigUtil from 'eth-sig-util';
import ethUtil from 'ethereumjs-util'
import BN from 'bn.js';

import {signTypedData} from '../platform/modules/web3/asyncActions';
import {FROM_BASE_TO_WEI, HOUSE_EDGE, HOUSE_EDGE_DIVISOR, RANGE} from '../config/config';
import Web3 from "web3";


export enum GameType {
    DICE_LOWER = 1,
    DICE_HIGHER = 2,
}


export function createHashChain(seed: string, len = 1000): Array<string> {
    const result = [ethUtil.toBuffer(seed)];
    for (let i = 0; i < len; i++) {
        result.unshift(ethUtil.sha3(result[0]));
    }

    return result.map(val => ethUtil.bufferToHex(val));
}


export function keccak(data: string): string {
    ethUtil.toBuffer(data);
    return ethUtil.bufferToHex(ethUtil.sha3(data));
}


export function verifySeed(seed: string, seedHashRef: string): boolean {
    const seedBuf = ethUtil.toBuffer(seed);
    const seedHashRefBuf = ethUtil.toBuffer(seedHashRef);

    const seedHashBuf = ethUtil.sha3(seedBuf);
    return seedHashRefBuf.equals(seedHashBuf);
}


export function fromBaseToWei(value: number): string {
    return new BN(value).mul(new BN(FROM_BASE_TO_WEI)).toString();
}


export function createTypedSignature(roundId: number, gameType: number, num: number, value: number, balance: number,
                                     serverHash: string, playerHash: string, gameId: number, contractAddress: string) {
    return [
        {
            'type': 'uint32',
            'name': "Round Id",
            'value': roundId
        },
        {
            'type': 'uint8',
            'name': 'Game Type',
            'value': gameType
        },
        {
            'type': 'uint16',
            'name': 'Number',
            'value': num
        },
        {
            'type': 'uint',
            'name': 'Value (Wei)',
            'value': fromBaseToWei(value)
        },
        {
            'type': 'int',
            'name': 'Current Balance (Wei)',
            'value': fromBaseToWei(balance)
        },
        {
            'type': 'bytes32',
            'name': 'Server Hash',
            'value': serverHash
        },
        {
            'type': 'bytes32',
            'name': 'Player Hash',
            'value': playerHash
        },
        {
            'type': 'uint',
            'name': 'Game Id',
            'value': gameId
        },
        {
            'type': 'address',
            'name': 'Contract Address',
            'value': contractAddress
        }
    ];
}

export function getLastGameId(web3: Web3, contract: any, player: string, transactionHash: string): Promise<number> {
    if (contract == null) {
        return Promise.reject("Error invalid web3 state!");
    }

    return web3.eth.getBlockNumber().then(blockNum => {
        return contract.getPastEvents('LogGameCreated', {
            filter: {player},
            fromBlock: blockNum - 4 * 3 * 60,
            toBlock: 'latest'
        });
    }).then(events => {
        const len = events.length;
        if (len === 0 && events[len - 1].transactionHash === transactionHash) {
            return Promise.reject(new Error("Could not find event!"));
        }

        return events[len - 1].returnValues.gameId;
    })
}


export function getServerHash(web3: Web3, contract: any, gameId: number, player: string): Promise<string> {
    return web3.eth.getBlockNumber().then(blockNum => {
        console.log(contract.events);
        return contract.getPastEvents('LogGameAccepted', {
            filter: {player},
            fromBlock: Math.max(blockNum - 4 * 3 * 60, 0)
        })
    }).then(events => {
        const len = events.length;
        if (len === 0 || Number.parseInt(events[len - 1].returnValues.gameId) !== gameId) {
            return Promise.reject(new Error("Could not read server hash!"));
        }

        return events[len - 1].returnValues.endHash;
    })
}


export function signBet(web3: Web3, account: string, roundId: number, gameType: number, num: number, value: number,
                        balance: number, serverHash: string, playerHash: string, gameId: number, contractAddress: string) {
    const typedData = createTypedSignature(roundId, gameType, num, value, balance, serverHash, playerHash, gameId, contractAddress);
    return signTypedData(web3, account, typedData);
}


export function verifyBetSignature(roundId: number, gameType: number, num: number, value: number, balance: number,
                                   serverHash: string, playerHash: string, gameId: number, contractAddress: string,
                                   sig: string, address: string) {
    const typedData = createTypedSignature(roundId, gameType, num, value, balance, serverHash, playerHash, gameId, contractAddress);
    return ethSigUtil.recoverTypedSignature({data: typedData, sig}) === address;
}


export function calcResultNumber(gameType: number, serverSeed: string, playerSeed: string): number {
    const serverSeedBuf = ethUtil.toBuffer(serverSeed);
    const playerSeedBuf = ethUtil.toBuffer(playerSeed);

    const seed = ethUtil.sha3(Buffer.concat([serverSeedBuf, playerSeedBuf]));
    const rand = new BN(seed);

    switch(gameType) {
        case GameType.DICE_HIGHER: return rand.mod(new BN(RANGE)).toNumber();
        case GameType.DICE_LOWER: return rand.mod(new BN(RANGE)).toNumber();
        default: throw new Error(`Invalid game type ${gameType}`);
    }
}


function calcPlayerProfitFromWon(totalWon: BN, betValue: BN) {
    const houseEdge = totalWon.mul(new BN(HOUSE_EDGE)).div(new BN(HOUSE_EDGE_DIVISOR));
    return totalWon.sub(houseEdge).sub(betValue).toNumber();
}


function calcPlayerProfitGameType1(num: number, betValue: number, resultNum: number): number {
    if (resultNum < num) {
        const betValueBN = new BN(betValue);

        const totalWon = betValueBN.mul(new BN(RANGE)).div(new BN(num));
        return calcPlayerProfitFromWon(totalWon, betValueBN);
    } else {
        return -betValue;
    }
}


function calcPlayerProfitGameType2(num: number, betValue: number, resultNum: number): number {
    if (resultNum > num) {
        const betValueBN = new BN(betValue);

        const totalWon = betValueBN.mul(new BN(RANGE)).div(new BN(RANGE - 1 - num));
        return calcPlayerProfitFromWon(totalWon, betValueBN);
    } else {
        return -betValue;
    }
}


export function calcPlayerProfit(gameType: number, num: number, betValue: number, resultNum: number): number {
    switch (gameType) {
        case GameType.DICE_LOWER: return calcPlayerProfitGameType1(num, betValue, resultNum);
        case GameType.DICE_HIGHER: return calcPlayerProfitGameType2(num, betValue, resultNum);
        default: throw new Error(`Invalid game type ${gameType}`);

    }
}
