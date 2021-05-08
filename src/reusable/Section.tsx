import ClassNames from "classnames";
import * as React from "react";

const Style = require("./Section.scss");

type Props = {
    children: React.ReactNode;
    className?: string;
    gray?: boolean;
};

const Section = ({gray = false, className = "", ...rest}: Props) => {
    const allClassNames = ClassNames(className, {
        [Style.gray]: gray,
    });

    return <section {...rest} className={allClassNames} />;
};

export default Section;
