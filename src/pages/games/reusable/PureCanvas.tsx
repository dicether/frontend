import * as React from "react";
import {useCallback, useEffect} from "react";
import {useResizeDetector} from "react-resize-detector";

interface Props {
    contextRef: (context: CanvasRenderingContext2D | null) => void;
    onResize?: () => void;
}

const PureCanvas = ({contextRef, onResize}: Props) => {
    const {width, ref} = useResizeDetector<HTMLCanvasElement>();

    const refCallback = useCallback((node: HTMLCanvasElement | null) => {
        if (node !== null) contextRef(node.getContext("2d"));
        ref(node);
    }, []);

    useEffect(() => {
        if (onResize) {
            onResize();
        }
    });

    return <canvas style={{width: "100%"}} width={width} height={width} ref={refCallback} />;
};

export default PureCanvas;
