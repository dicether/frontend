import * as React from "react";

import PayoutTable from "./PayoutTable";
import AnimatedWheel from "./WheelAnimation";

const Style = require("./WheelGrid.scss");
const DayColors = require("./WheelDayColors.scss");
const NightColors = require("./WheelNightColors.scss");

type Props = {
    nightMode: boolean;
    segments: number[];
    angle: number; // in radians
    payout: {multiplier: number; value: number; show: boolean};
};

class WheelGrid extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    private static calcSegmentColors = (segments: number[], nightMode: boolean) => {
        const colors = nightMode ? NightColors : DayColors;

        let curColorIdx = 0;
        const colorLookup: {[key: number]: string} = {};
        for (const segment of segments) {
            if (!(segment in colorLookup)) {
                const color = colors[`color${curColorIdx % 6}`];
                colorLookup[segment] = color;
                curColorIdx += 1;
            }
        }

        return colorLookup;
    }

    public render() {
        const {nightMode, segments, angle, payout} = this.props;

        const segmentColorsLookup = WheelGrid.calcSegmentColors(segments, nightMode);
        const segmentColors = segments.map(x => segmentColorsLookup[x]);
        const color = segmentColorsLookup[payout.multiplier];

        const payoutTable = Object.entries(segmentColorsLookup)
            .map(([value, color]) => ({
                value: Number.parseInt(value, 10),
                color,
            }))
            .sort((x1, x2) => x1.value - x2.value);

        return (
            <div className={Style.wrapper}>
                <div className={Style.wheelGrid}>
                    <AnimatedWheel
                        nightMode={nightMode}
                        segmentColors={segmentColors}
                        position={angle}
                        payout={{...payout, multiplier: payout.multiplier, color}}
                    />
                    <PayoutTable
                        payoutTable={payoutTable}
                        showMultiplier={payout.show}
                        multiplier={payout.multiplier}
                    />
                </div>
            </div>
        );
    }
}

export default WheelGrid;
