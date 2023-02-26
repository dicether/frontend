import * as React from "react";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // tslint:disable-line:no-submodule-imports

import Style from "./Notification.scss";

const CloseButton = () => <button type="button" className="btn-close btn-close-white" aria-label="Close" />;

export type Props = {
    notification: any;
};

export default class Notification extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.notification !== this.props.notification && nextProps.notification !== null) {
            const notification = nextProps.notification;
            if (notification.type === "success") {
                toast.success(<div style={{width: "275px", wordWrap: "break-word"}}>{notification.message}</div>);
            } else if (notification.type === "info") {
                toast.info(<div style={{width: "275px", wordWrap: "break-word"}}>{notification.message}</div>);
            } else {
                toast.error(
                    /*<div style={{width: "275px", wordWrap: "break-word"}}>{*/ notification.message /*}</div>*/
                );
            }
        }
    }

    render() {
        return (
            <ToastContainer
                icon={false}
                toastClassName={Style.notification}
                position="top-left"
                autoClose={5000}
                hideProgressBar={true}
                closeOnClick
                pauseOnHover={false}
                closeButton={<CloseButton />}
            />
        );
    }
}
