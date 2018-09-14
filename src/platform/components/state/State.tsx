import * as React from 'react';
import {connect} from 'react-redux';

import {catchError} from "../../modules/utilities/asyncActions";
import {clearState} from "../../modules/games/state/actions";
import {conflictEnd, canUserInitiateConflictEnd} from "../../modules/games/state/asyncActions";
import {Output} from '../../../reusable/index';
import {State} from '../../../rootReducer';
import ClearState from "./ClearState";
import ConflictEnd from "./ConflictEnd";
import {Dispatch} from "../../../util/util";

const Style = require('./State.scss');


type EntryProps = {
    id: string,
    name: string,
    data?: string | number
}


const Entry = ({id, name, data}: EntryProps) => {
    if (data) {
        return (
            <div className={Style.gameState__entry}>
                <span>{name}</span>
                <Output className={Style.gameState__value} id={id} value={data}/>
            </div>
        );
    } else {
        return null;
    }
};


const mapStateToProps = ({games}: State) => {
    const {gameState} = games;

    return {
        gameState,
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    clearState: () => dispatch(clearState()),
    conflictEnd: () => dispatch(conflictEnd()),
    catchError: (error) => catchError(error, dispatch)
});

type Props =  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const State = ({gameState, clearState, conflictEnd, catchError}: Props) => {
    return (
        <div>
            <div>
                <ClearState clearState={clearState}/>{" "}
                {canUserInitiateConflictEnd(gameState) &&
                    <ConflictEnd conflictEnd={() => conflictEnd().catch(catchError)}/>
                }
            </div>
            <Entry id={'gameState_status'} name="Status" data={gameState.status}/>
            <Entry id={'gameState_reasonEnded'} name="Reason Ended" data={gameState.reasonEnded}/>
            <Entry id={'gameState_createTransactionHash'} name="Create Transaction Hash" data={gameState.createTransactionHash}/>
            <Entry id={'gameState_endTransactionHash'} name="End Transaction Hash" data={gameState.endTransactionHash}/>
            <Entry id={'gameState_gameId'} name="Game Id" data={gameState.gameId}/>
            <Entry id={'gameState_roundId'} name="Round Id" data={gameState.roundId}/>
            <Entry id={'gameState_gameType'} name="Game Type" data={gameState.gameType}/>
            <Entry id={'gameState_num'} name="Number" data={gameState.num}/>
            <Entry id={'gameState_betValue'} name="Bet Value" data={gameState.betValue}/>
            <Entry id={'gameState_balance'} name="Balance" data={gameState.balance}/>
            <Entry id={'gameState_serverHash'} name="Server Hash" data={gameState.serverHash}/>
            <Entry id={'gameState_userHash'} name="User Hash" data={gameState.userHash}/>
            <Entry id={'gameState_serverSig'} name="Server Signature" data={gameState.serverSig}/>
            <Entry id={'gameState_playerSig'} name="Player Sigature" data={gameState.userSig}/>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(State);
