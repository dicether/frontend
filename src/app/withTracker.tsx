import * as React from "react";

type Props = {
    location: Location;
};

const withTracker = (WrappedComponent: React.ComponentType<any>) => {
    let lastPage: string | null = null;

    const trackPage = (page: string) => {
        if (lastPage !== page) {
            const ga = (window as any).ga;
            if (ga) {
                ga("set", "page", page);
                ga("send", "pageview", page);
            }
            lastPage = page;
        }
    };

    const WithTracker = (props: Props) => {
        const page = props.location.pathname;
        trackPage(page);

        return <WrappedComponent {...props} />;
    };

    WithTracker.displayName = `WithTracker(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
    return WithTracker;
};

export default withTracker;
