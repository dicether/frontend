import * as React from "react";
import {Link} from "react-router-dom";
import {ButtonToolbar} from "reactstrap"; // FIXME: Remove

import GameState from "../../../platform/components/state/State";
import {Button, FancyIconButton, Popover, Switch} from "../../../reusable/index";

import * as Style from "./GameFooter.scss";

interface Props {
    authenticated: boolean;
    showHelp: boolean;
    showExpertView: boolean;
    sound: boolean;

    onToggleExpertView(b: boolean): void;
    onToggleHelp(b: boolean): void;
    onToggleSound(b: boolean): void;
}

interface State {
    showSettingsPopover: boolean;
}

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
    };

    render() {
        const {authenticated, showHelp, onToggleHelp, showExpertView, onToggleExpertView, sound, onToggleSound} =
            this.props;
        const {showSettingsPopover} = this.state;

        return (
            <div className={Style.gameFooter}>
                <ButtonToolbar>
                    <FancyIconButton color="400" id="settingsPopover" icon="cog" onClick={this.toggleSettingsPopover} />
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
                    <FancyIconButton color="400" icon="question" onClick={() => onToggleHelp(!showHelp)} />
                    {authenticated && (
                        <Button tag={Link} to="/account/affiliate" color="400" size="sm">
                            Refer friends
                        </Button>
                    )}
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
