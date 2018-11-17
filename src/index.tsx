import "@babel/polyfill";
import Raven from "raven-js";
import * as React from "react";
import {render} from "react-dom";
import "what-input";

import "./config/interceptors";
import "./googleanalytics";
import Root from "./Root";
import {store} from "./store";
import {parseReferral} from "./util/affiliate";
import "./util/prototypes";

parseReferral();

const root = document.getElementById("root");
if (root !== null) {
    Raven.context(() => {
        render(<Root store={store} />, root);
    });
}
