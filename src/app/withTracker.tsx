import * as React from 'react';


type Props = {
  location: Location;
}

const withTracker = (WrappedComponent: React.ComponentType<any>) => {
    let lastPage: string | null = null;

    const trackPage = (page: string) => {
        if (lastPage !== page) {
            const ga = (window as any).ga;
            if (ga) {
                ga('set', 'page', page);
                ga('send', 'pageview', page);
            }
            lastPage = page;
        }
    };

    return (props: Props) => {
        const page = props.location.pathname;
        trackPage(page);

        return (
            <WrappedComponent {...props} />
        );
    };
};

export default withTracker;
