import "core-js/stable";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import * as React from "react";
import {render} from "react-dom";
import ReactGA from "react-ga4";
import "regenerator-runtime/runtime";
import "what-input";

import "./config/interceptors";
import Root from "./Root";
import {store} from "./store";
import {parseReferral} from "./util/affiliate";

ReactGA.initialize("G-JHM0P25QLT");

dayjs.extend(localizedFormat);

parseReferral();

import ResizeObserver from "resize-observer-polyfill";

if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserver;
}

const root = document.getElementById("root");
if (root !== null) {
    render(<Root store={store} />, root);
}
