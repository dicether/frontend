import ClassNames from "classnames";
import * as React from "react";
import {useEffect} from "react";
import {toast, ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import * as Style from "./Notification.scss";

const CloseButton = () => {
    const classNames = ClassNames(Style.closeButton, "btn-close btn-close-white");
    return <button type="button" className={classNames} aria-label="Close" />;
};

export interface Props {
    notification: any;
}

const Notification = (props: Props) => {
    useEffect(() => {
        const notification = props.notification;
        if (notification == null) return;

        if (notification.type === "success") {
            toast.success(<div style={{width: "275px", wordWrap: "break-word"}}>{notification.message}</div>);
        } else if (notification.type === "info") {
            toast.info(<div style={{width: "275px", wordWrap: "break-word"}}>{notification.message}</div>);
        } else {
            toast.error(/*<div style={{width: "275px", wordWrap: "break-word"}}>{*/ notification.message /*}</div>*/);
        }
    }, [props.notification]);

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
};

export default Notification;
