import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import Textarea from "react-textarea-autosize";
import {Button} from "../../../../reusable/index";
import ChatCommandInfo from "./ChatCommandInfo";

import Style from "./Footer.scss";
import {useState} from "react";

export interface Props extends WithTranslation {
    maxMessageLength: number;
    numUsers: number;
    onMessageSend(message: string): void;
}

const Footer = ({maxMessageLength, numUsers, onMessageSend, t}: Props) => {
    const [message, setMessage] = useState("");

    const onMessageChange = (message: string) => {
        if (message.length > maxMessageLength) {
            message = message.slice(0, maxMessageLength);
        }
        setMessage(message);
    };

    return (
        <div className={Style.footer}>
            <ChatCommandInfo message={message} />
            <div className="form-group">
                <Textarea
                    className={"form-control " + Style.textarea}
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            // send on enter key press
                            onMessageSend(message);
                            e.preventDefault();
                        }
                    }}
                    placeholder={t("typeMessage")}
                    rows={1}
                />
            </div>
            <div className={Style.footerFooter}>
                <Button color="primary" onClick={() => onMessageSend(message)}>
                    {t("sendMessage")}
                </Button>
                <span className={Style.online}>online: {numUsers}</span>
            </div>
        </div>
    );
};

export default withTranslation()(Footer);
