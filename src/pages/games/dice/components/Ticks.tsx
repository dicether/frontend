import * as React from "react";

import * as Style from "./Ticks.scss";

const Ticks = () => (
    <div className={Style.ticks}>
        <span className={Style.ticks__tick} style={{left: "0%"}}>
            0
        </span>
        <span className={Style.ticks__tick} style={{left: "25%"}}>
            25
        </span>
        <span className={Style.ticks__tick} style={{left: "50%"}}>
            50
        </span>
        <span className={Style.ticks__tick} style={{left: "75%"}}>
            75
        </span>
        <span className={Style.ticks__tick} style={{left: "100%"}}>
            100
        </span>
    </div>
);

export default Ticks;
