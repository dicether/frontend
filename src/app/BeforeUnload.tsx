import * as React from "react";

import {State as GameState} from "../platform/modules/games/state/reducer";

export interface Props {
    gameState: GameState;
}

class BeforeUnload extends React.Component<Props> {
    componentDidMount() {
        window.addEventListener("beforeunload", this.handleBeforeUnload);
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.handleBeforeUnload);
    }

    private handleBeforeUnload = (event: Event) => {
        const {gameState} = this.props;

        if (gameState.status === "ACTIVE") {
            const message = "You need to end the game session before leaving!";
            (event.returnValue as any) = message;
            return message;
        }

        return undefined;
    };

    render() {
        return null;
    }
}

export default BeforeUnload;
