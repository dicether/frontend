import * as React from "react";

import {ButtonToolbar} from "reactstrap"; // FIXME: Remove
import GameState from "../../../platform/components/state/State";
import {IconButton, Popover, Switch} from "../../../reusable/index";

const Style = require("./GameFooter.scss");

type Props = {
    showHelp: boolean;
    showExpertView: boolean;
    sound: boolean;

    onToggleExpertView(b: boolean): void;
    onToggleHelp(b: boolean): void;
    onToggleSound(b: boolean): void;
};

type State = {
    showSettingsPopover: boolean;
};

export default class GameFooter extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showSettingsPopover: false,
        };
    }

    toggleSettingsPopover = () => {
        this.setState({
            showSettingsPopover: !this.state.showSettingsPopover,
        });
    }

    render() {
        const {showHelp, onToggleHelp, showExpertView, onToggleExpertView, sound, onToggleSound} = this.props;
        const {showSettingsPopover} = this.state;

        return (
            <div className={Style.gameFooter}>
                <ButtonToolbar>
                    <IconButton
                        color="secondary"
                        id="settingsPopover"
                        icon="cog"
                        onClick={this.toggleSettingsPopover}
                    />
                    <Popover
                        target="settingsPopover"
                        placement="top"
                        isOpen={showSettingsPopover}
                        toggle={this.toggleSettingsPopover}
                    >
                        <ul className={Style.settings}>
                            <li className={Style.settings__setting}>
                                <span className={Style.settings__key}>Expert View</span>
                                <Switch size="sm" enabled={showExpertView} onToggle={onToggleExpertView} />
                            </li>
                            <li className={Style.settings__setting}>
                                <span className={Style.settings__key}>Sound</span>
                                <Switch size="sm" enabled={sound} onToggle={onToggleSound} />
                            </li>
                        </ul>
                    </Popover>
                    <IconButton color="secondary" icon="question" onClick={() => onToggleHelp(!showHelp)} />
                </ButtonToolbar>
                {showExpertView && (
                    <div className={Style.state}>
                        <GameState />
                    </div>
                )}
            </div>
        );
    }
}
