import * as React from "react";

import {State as GameState} from "../platform/modules/games/state/reducer";

export type Props = {
    gameState: GameState;
};

class BeforeUnload extends React.Component<Props> {
    componentDidMount() {
        window.addEventListener("beforeunload", this.handleBeforeUnload);
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.handleBeforeUnload);
    }

    handleBeforeUnload = event => {
        const {gameState} = this.props;

        if (gameState.status === "ACTIVE") {
            const message = "You need to end the game session before leaving!";
            event.returnValue = message;
            return message;
        }

        return undefined;
    }

    render() {
        return null;
    }
}

export default BeforeUnload;
