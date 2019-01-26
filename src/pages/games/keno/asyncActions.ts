// import {Dispatch, GetState} from "../../../util/util";
// import {getRandomInt} from "../../../util/math";
//
//
// function selectRandomTile(num: number, numTiles: number) {
//     let tile = 0;
//
//     do {
//         tile = getRandomInt(0, numTiles);
//     } while ((1 << tile) & num); // tslint:disable-line:no-bitwise
//
//     return tile;
// }
//
//
// export function selectMissingTiles() {
//     return (dispatch: Dispatch, getState: GetState) => {
//         const curNum = getState().games.keno.num;
//     };
// }
//
//
// export function toggleTile(tile: number) {
//
// }
