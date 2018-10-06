import io from "socket.io-client";

import {SOCKET_URL} from "./config";

export const SOCKET = io.connect(SOCKET_URL);
