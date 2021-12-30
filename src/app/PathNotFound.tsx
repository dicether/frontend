import * as React from "react";
import {Container} from "../reusable";

type PathNotFoundProps = {
    insideContainer?: boolean;
};

const PathNotFound = ({insideContainer = false}: PathNotFoundProps) =>
    insideContainer ? (
        <Container>
            <h1 className="text-danger text-center">404 Oops, this path does not exist!</h1>
        </Container>
    ) : (
        <h1 className="text-danger text-center">404 Oops, this path does not exist!</h1>
    );

export default PathNotFound;
