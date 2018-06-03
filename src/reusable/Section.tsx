import * as React from "react";
import ClassNames from "classnames";

const Style = require("./Section.scss");


type Props = {
    children: React.ReactNode,
    className?: string
    gray?: boolean
}


const Section = ({container=true, gray=false, className="", ...rest}) => {
    const allClassNames = ClassNames(
        className,
        {
        [Style.gray]: gray
        }
    );

    return (
        <section {...rest} className={allClassNames}>
        </section>
    );
};

export default Section;
