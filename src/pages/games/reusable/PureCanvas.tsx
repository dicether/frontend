import * as React from "react";

type Props = {
    contextRef(context: CanvasRenderingContext2D | null): void;
    width: number;
    height: number;
};

export default class PureCanvas extends React.Component<Props> {
    shouldComponentUpdate(nextProps: Props) {
        return nextProps.height !== this.props.height || nextProps.width !== this.props.height;
    }

    render() {
        const {width, height} = this.props;

        return (
            <canvas
                style={{width: "100%"}}
                width={width}
                height={height}
                ref={(node) => (node ? this.props.contextRef(node.getContext("2d")) : null)}
            />
        );
    }
}
