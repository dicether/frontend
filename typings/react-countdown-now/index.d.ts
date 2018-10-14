import * as React from "react";

export type CountDownProps = {
    renderer(...args: any[]): React.ReactNode;
    date: number;
};

declare class CountDown extends React.Component<CountDownProps> {}

export default CountDown;
