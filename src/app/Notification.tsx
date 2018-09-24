import * as React from 'react';
import {ToastContainer, toast} from 'react-toastify';

const Style = require('./Notification.scss');
import 'react-toastify/dist/ReactToastify.css';


const CloseButton = () => (
    <button type="button" className="close" aria-label="Close" style={{color: '#fff', alignSelf: 'flex-start'}}>
        <span aria-hidden="true">&times;</span>
    </button>
);


export type Props = {
    notification: any
}


export default class Notification extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.notification !== this.props.notification && nextProps.notification !== null) {
            const notification = nextProps.notification;
            if (notification.type === "success") {
                toast.success(<div style={{width: '285px', wordWrap: 'break-word'}}>{notification.message}</div>);
            } else if (notification.type === "info") {
                toast.info(<div style={{width: '285px', wordWrap: 'break-word'}}>{notification.message}</div>);
            } else {
                toast.error(<div style={{width: '285px', wordWrap: 'break-word'}}>{notification.message}</div>);
            }
        }
    }

    render() {
        return (
            <ToastContainer
                toastClassName={Style.notification}
                position="top-left"
                autoClose={5000}
                hideProgressBar={true}
                closeOnClick
                pauseOnHover={false}
                closeButton={<CloseButton/>}
            />
        )
    }
}
