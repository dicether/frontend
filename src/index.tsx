import "core-js/stable";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import * as React from "react";
import {createRoot} from "react-dom/client";
import ReactGA from "react-ga4";
import "regenerator-runtime/runtime";
import "what-input";

import "./config/interceptors";
import ResizeObserver from "resize-observer-polyfill";

import Root from "./Root";
import {store} from "./store";
import {parseReferral} from "./util/affiliate";

ReactGA.initialize("G-JHM0P25QLT");

dayjs.extend(localizedFormat);

parseReferral();

if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserver;
}

const container = document.getElementById("root");
if (container !== null) {
    const root = createRoot(container);
    root.render(<Root store={store} />);
}
