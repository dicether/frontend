import {connect} from "socket.io-client";

import {SOCKET_URL} from "./config";

export const SOCKET = connect(SOCKET_URL);
