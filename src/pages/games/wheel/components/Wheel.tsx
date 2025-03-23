import * as React from "react";
import {useEffect, useState} from "react";
import {useRef} from "react";
import ReactResizeDetector, {useResizeDetector} from "react-resize-detector";

import PureCanvas from "../../reusable/PureCanvas";
import {formatMultiplier} from "./utility";

import * as Style from "./Wheel.scss";
import * as ColorDay from "./WheelDayColors.scss";
import * as ColorNight from "./WheelNightColors.scss";

type Props = {
    nightMode: boolean;
    segmentColors: string[];
    angle: number; // in radians
    payout: {color: string; value: number; show: boolean; multiplier: number};
};

const drawSegment = (ctx: CanvasRenderingContext2D, angle: number, color: string) => {
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
};

const drawSegmentDots = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.fillStyle = "#fafafa";
    ctx.arc(93.5, 0, 1.5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
};

const Wheel = ({nightMode, segmentColors, angle, payout}: Props) => {
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [size, setSize] = useState(500);

    const renderToCanvas = () => {
        const colors = nightMode ? ColorNight : ColorDay;
        const ctx = ctxRef.current;

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
            drawSegment(ctx, segmentAngle, segmentColor);
            ctx.rotate(segmentAngle);
        }
        ctx.restore();

        // draw segment dots
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        for (const _ of segmentColors) {
            drawSegmentDots(ctx);
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
    };

    const saveContext = (ctx: CanvasRenderingContext2D) => {
        ctxRef.current = ctx;
    };

    const onResize = (width?: number) => {
        if (width === undefined) return;

        setSize(width);
    };

    useEffect(() => {
        renderToCanvas();
    }, []);

    useEffect(() => {
        renderToCanvas();
    }, [nightMode, segmentColors, angle, payout, size]);

    useResizeDetector({
        handleHeight: false,
        refreshMode: "debounce",
        refreshRate: 1000,
        onResize,
    });

    return (
        <div className={Style.wheel}>
            <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
            <PureCanvas width={size} height={size} contextRef={saveContext} />
        </div>
    );
};

export default Wheel;
