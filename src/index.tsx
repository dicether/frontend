import "core-js/stable";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import * as React from "react";
import {render} from "react-dom";
import "regenerator-runtime/runtime";
import "what-input";

import "./config/interceptors";
import "./googleanalytics";
import Root from "./Root";
import {store} from "./store";
import {parseReferral} from "./util/affiliate";
import "./util/prototypes";

dayjs.extend(localizedFormat);

parseReferral();

const root = document.getElementById("root");
if (root !== null) {
    render(<Root store={store} />, root);
}
