import * as React from "react";

import {Tooltip} from "../../../../reusable/index";

import * as Style from "./UserType.scss";

interface Props {
    userType: string;
}

const UserType = ({userType}: Props) => {
    let target: HTMLElement | null = null;

    if (userType === "ADM") {
        return (
            <span>
                <span
                    ref={(t) => {
                        target = t;
                    }}
                    className={Style.userType + " " + Style.userType_adm}
                >
                    A
                </span>
                <Tooltip target={() => target}>Admin</Tooltip>
            </span>
        );
    } else if (userType === "DEV") {
        return (
            <span>
                <span
                    ref={(t) => {
                        target = t;
                    }}
                    className={Style.userType + " " + Style.userType_dev}
                >
                    D
                </span>
                <Tooltip target={() => target}>Developer</Tooltip>
            </span>
        );
    } else if (userType === "MOD") {
        return (
            <span>
                <span
                    ref={(t) => {
                        target = t;
                    }}
                    className={Style.userType + " " + Style.userType_mod}
                >
                    M
                </span>
                <Tooltip target={() => target}>Moderator</Tooltip>
            </span>
        );
    } else if (userType === "VIP") {
        return (
            <span>
                <span
                    ref={(t) => {
                        target = t;
                    }}
                    className={Style.userType + " " + Style.userType_vip}
                >
                    V
                </span>
                <Tooltip target={() => target}>VIP User</Tooltip>
            </span>
        );
    } else if (userType === "BOT") {
        return (
            <span>
                <span
                    ref={(t) => {
                        target = t;
                    }}
                    className={Style.userType + " " + Style.userType_bot}
                >
                    B
                </span>
                <Tooltip target={() => target}>Bot</Tooltip>
            </span>
        );
    } else {
        return null;
    }
};

export default UserType;
