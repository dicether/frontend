import * as React from 'react';
import Textarea from 'react-textarea-autosize';
import {Button} from '../../../../reusable/index';

const Style = require('./Footer.scss');


type Props = {
    message: string,
    numUsers: number,
    onMessageChange(message: string): void,
    onMessageSend(): void
}

const Footer = ({message, numUsers, onMessageChange, onMessageSend} : Props) => {
        return (
            <div className={Style.footer}>
                <div className="form-group">
                    <Textarea
                        className={"form-control " + Style.textarea}
                        value={message}
                        onChange={e => onMessageChange(e.target.value)}
                        onKeyDown={e => {
                            if (e.keyCode === 13) { // send on enter key press
                                onMessageSend();
                                e.preventDefault();
                            }
                        }}
                        placeholder="Type a message"
                        rows={1}
                    />
                </div>
                <div className={Style.footerFooter}>
                    <Button
                        color="primary"
                        onClick={onMessageSend}>
                        Send Message
                    </Button>
                    <span className={Style.online}>online: {numUsers}</span>
                </div>
            </div>
        );
};

export default Footer;
