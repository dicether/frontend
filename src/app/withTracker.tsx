import * as React from "react";
import ReactGA from "react-ga4";
import {useLocation} from "react-router-dom";

const withTracker = (WrappedComponent: React.ComponentType<any>) => {
    let lastPage: string | null = null;

    const trackPage = (page: string) => {
        if (lastPage !== page) {
            ReactGA.send({hitType: "pageview", page: page, title: document.title});
            const ga = (window as any).ga;
            if (ga) {
                ga("set", "page", page);
                ga("send", "pageview", page);
            }
            lastPage = page;
        }
    };

    const WithTracker = () => {
        const location = useLocation();
        const page = location.pathname;
        trackPage(page);

        return <WrappedComponent />;
    };

    WithTracker.displayName = `WithTracker(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
    return WithTracker;
};

export default withTracker;
