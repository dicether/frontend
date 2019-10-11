import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import Textarea from "react-textarea-autosize";
import {Button} from "../../../../reusable/index";
import ChatCommandInfo from "./ChatCommandInfo";

const Style = require("./Footer.scss");

export interface Props extends WithTranslation {
    message: string;
    numUsers: number;
    onMessageChange(message: string): void;
    onMessageSend(): void;
}

const Footer = ({message, numUsers, onMessageChange, onMessageSend, t}: Props) => {
    return (
        <div className={Style.footer}>
            <ChatCommandInfo message={message} />
            <div className="form-group">
                <Textarea
                    className={"form-control " + Style.textarea}
                    value={message}
                    onChange={e => onMessageChange(e.target.value)}
                    onKeyDown={e => {
                        if (e.keyCode === 13) {
                            // send on enter key press
                            onMessageSend();
                            e.preventDefault();
                        }
                    }}
                    placeholder={t("typeMessage")}
                    rows={1}
                />
            </div>
            <div className={Style.footerFooter}>
                <Button color="primary" onClick={onMessageSend}>
                    {t("sendMessage")}
                </Button>
                <span className={Style.online}>online: {numUsers}</span>
            </div>
        </div>
    );
};

export default withTranslation()(Footer);
