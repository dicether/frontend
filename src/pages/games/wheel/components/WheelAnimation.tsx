import * as React from "react";
import Wheel from "./Wheel";

type Props = {
    nightMode: boolean;
    segmentColors: string[];
    position: number;
    payout: {show: boolean; value: number; multiplier: number; color: string};
};

type State = {
    previousPosition: number;
    animationStartTime: number;
    currentPosition: number;
};

export default class AnimatedWheel extends React.Component<Props, State> {
    private static ANIMATION_TIME = 5000; // 2 seconds
    private static MIN_ROTATIONS = 2;

    public constructor(props: Props) {
        super(props);
        this.state = {
            previousPosition: this.props.position,
            animationStartTime: 0,
            currentPosition: this.props.position,
        };
    }

    public componentDidUpdate(prevProps: Props) {
        if (this.props.position !== prevProps.position) {
            this.setState({
                previousPosition: prevProps.position,
                currentPosition: prevProps.position,
                animationStartTime: Date.now(),
            });
            requestAnimationFrame(this.updatePosition);
        }
    }

    private updatePosition = () => {
        const {previousPosition, animationStartTime} = this.state;
        const {position: targetPosition} = this.props;
        const currentTime = Date.now();

        if (currentTime > animationStartTime + AnimatedWheel.ANIMATION_TIME) {
            this.setState({currentPosition: targetPosition});
            return;
        }

        const newPosition = AnimatedWheel.calcNewPos(
            previousPosition,
            targetPosition,
            currentTime,
            animationStartTime,
            animationStartTime + AnimatedWheel.ANIMATION_TIME
        );

        this.setState({currentPosition: newPosition});

        requestAnimationFrame(this.updatePosition);
    }

    private static calcNewPos(
        startPosition: number,
        targetPosition: number,
        curTime: number,
        startTime: number,
        endTime: number
    ) {
        // TODO: add documentation for acceleration calculation
        const animationTime = endTime - startTime;
        const t = curTime - startTime;
        const spinUpTime = 0.01 * animationTime;

        let distToTarget = targetPosition - startPosition;
        distToTarget = distToTarget < 0 ? distToTarget + 2 * Math.PI : distToTarget;
        const distance = distToTarget + this.MIN_ROTATIONS * 2 * Math.PI;
        const acceleration = (2 * distance) / (spinUpTime * (animationTime - spinUpTime) + spinUpTime * spinUpTime);

        if (t < spinUpTime) {
            return startPosition + 0.5 * t * t * acceleration;
        } else if (curTime < endTime) {
            const pos1 = startPosition + 0.5 * spinUpTime * spinUpTime * acceleration;
            return (
                pos1 -
                ((0.5 * acceleration * spinUpTime) / (animationTime - spinUpTime)) * t * t +
                acceleration * spinUpTime * t
            );
        } else {
            return targetPosition;
        }
    }

    public render() {
        const {nightMode, segmentColors, payout} = this.props;

        return (
            <Wheel
                nightMode={nightMode}
                segmentColors={segmentColors}
                angle={this.state.currentPosition % (2 * Math.PI)}
                payout={payout}
            />
        );
    }
}
