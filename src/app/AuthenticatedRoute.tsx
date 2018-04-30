import * as React from 'react';
import {Route, Redirect} from 'react-router-dom'
import {RouteProps} from "react-router";


interface Props extends RouteProps {
    component: any,
    authenticated: boolean

}

const AuthenticatedRoute = ({component: Component, authenticated, ...rest }: Props) => (
  <Route {...rest} render={props => (
    authenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

export default AuthenticatedRoute;
