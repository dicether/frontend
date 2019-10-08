import * as React from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";

interface Props extends RouteProps {
    component: any;
    authenticated: boolean;
}

const AuthenticatedRoute = ({component: Component, authenticated, ...rest}: Props) => (
    <Route
        {...rest}
        render={props =>
            authenticated ? <Component {...props} /> : <Redirect to={{pathname: "/", state: {from: props.location}}} />
        }
    />
);

export default AuthenticatedRoute;
