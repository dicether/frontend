import * as React from "react";
import ReactResizeDetector from "react-resize-detector";

import PureCanvas from "../../reusable/PureCanvas";
import {formatMultiplier} from "./utility";

const Style = require("./Wheel.scss");
const ColorDay = require("./WheelDayColors.scss");
const ColorNight = require("./WheelNightColors.scss");

type Props = {
    nightMode: boolean;
    segmentColors: string[];
    angle: number; // in radians
    payout: {color: string; value: number; show: boolean; multiplier: number};
};

type State = {
    size: number;
};

export default class Wheel extends React.Component<Props, State> {
    private ctx: CanvasRenderingContext2D | null = null;
    private parent = React.createRef<HTMLDivElement>();

    public constructor(props: Props) {
        super(props);

        this.state = {
            size: 500,
        };
    }

    public componentDidMount() {
        this.renderToCanvas();
    }

    public componentDidUpdate() {
        this.renderToCanvas();
    }

    private renderToCanvas = () => {
        const {angle, nightMode, segmentColors, payout} = this.props;
        const colors = nightMode ? ColorNight : ColorDay;
        // console.log("angle", angle);
        const ctx = this.ctx;

        if (ctx === null) {
            return;
        }

        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const segmentAngle = (2 * Math.PI) / segmentColors.length;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.scale(width / 210, height / 210);
        ctx.translate(105, 105);

        ctx.save();

        ctx.rotate(angle);

        // draw outer border
        ctx.beginPath();
        ctx.fillStyle = colors.outerBorder;
        ctx.arc(0, 0, 100, 0, 2 * Math.PI);
        ctx.fill();

        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(0, 0, 95, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        // draw segments
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        for (const segmentColor of segmentColors) {
            Wheel.drawSegment(ctx, segmentAngle, segmentColor);
            ctx.rotate(segmentAngle);
        }
        ctx.restore();

        // draw segment dots
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        for (const _ of segmentColors) {
            Wheel.drawSegmentDots(ctx, segmentAngle);
            ctx.rotate(segmentAngle);
        }
        ctx.restore();

        ctx.restore();

        // draw arrow
        ctx.beginPath();
        ctx.moveTo(-3, -102);
        ctx.lineTo(0, -85);
        ctx.lineTo(3, -102);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();

        // draw result
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, 2 * Math.PI);
        ctx.strokeStyle = colors.innerBorder;
        ctx.stroke();

        if (payout.show) {
            // draw text
            ctx.fillStyle = payout.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `16px ${Style.font}`;
            ctx.fillText(formatMultiplier(payout.multiplier), 0, 0);
        }

        ctx.restore();
    }

    private static drawSegment = (ctx: CanvasRenderingContext2D, angle: number, color: string) => {
        ctx.beginPath();
        ctx.fillStyle = color;
        // ctx.strokeStyle = "#fafafa";
        // ctx.lineWidth = 2;

        ctx.arc(0, 0, 95, angle, 0, true);
        ctx.lineTo(80, 0);
        ctx.arc(0, 0, 80, 0, angle);

        ctx.closePath();
        // ctx.stroke();
        ctx.fill();
        // outer border

        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.arc(0, 0, 92, angle, 0, true);
        ctx.lineTo(90, 0);
        ctx.lineTo(90, 0);
        ctx.arc(0, 0, 90, 0, angle);
        ctx.closePath();
        ctx.fill();

        // ctx.arc(0, 0, 95, 0, angle, false);
        // ctx.lineTo(0, 0);
        // ctx.lineTo(95, 0);
    }

    private static drawSegmentDots = (ctx: CanvasRenderingContext2D, angle: number) => {
        ctx.beginPath();
        ctx.fillStyle = "#fafafa";
        ctx.arc(93.5, 0, 1.5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    private saveContext = (ctx: CanvasRenderingContext2D) => {
        this.ctx = ctx;
    }

    private onResize = (size: number) => {
        this.setState({
            size,
        });
        this.renderToCanvas();
    }

    public render() {
        // const width = this.parent.current !== null ? this.parent.current.offsetWidth : 500;
        // const height = this.parent.current !== null ? this.parent.current.offsetHeight : 500;
        const {size} = this.state;

        return (
            <div ref={this.parent} className={Style.wheel}>
                <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
                <PureCanvas width={size} height={size} contextRef={this.saveContext} />
            </div>
        );
    }
}
