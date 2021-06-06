import axios, {AxiosError} from "axios";
import * as React from "react";

import Icon from "./FontAwesomeIcon";

import Style from "./DataLoader.scss";

const Loading = () => (
    <div className={Style.info}>
        <Icon icon="spinner" spin size="lg" />
    </div>
);

const Failure = () => (
    <div className={Style.info}>
        <span className="text-danger">Error loading Data</span>
    </div>
);

const NotFound = () => (
    <div className={Style.info}>
        <span className="text-danger">404 Not Found</span>
    </div>
);

type Props<T> = {
    url: string;
    success(data: T): React.ReactNode;
    loading?(): React.ReactNode;
    notFound?(): React.ReactNode;
    failure?(): React.ReactNode;
};

type State<T> = {
    data: T | undefined;
    error: AxiosError | undefined;
};

class DataLoader<T = any> extends React.Component<Props<T>, State<T>> {
    static defaultProps = {
        loading: () => <Loading />,
        notFound: () => <NotFound />,
        failure: () => <Failure />,
    };

    constructor(props: Props<T>) {
        super(props);

        this.state = {
            data: undefined,
            error: undefined,
        };
    }

    componentDidMount() {
        const {url} = this.props;

        axios
            .get<T>(url)
            .then((response) => {
                const data = response.data;
                this.setState({data});
            })
            .catch((error) => {
                this.setState({error});
            });
    }

    render() {
        const {failure, notFound, loading, success} = this.props;
        const {data, error} = this.state;

        if (data) {
            return success(data);
        } else if (error) {
            if (error.response && error.response.status === 404) {
                return notFound ? notFound() : null;
            } else {
                return failure ? failure() : null;
            }
        } else {
            return loading ? loading() : null;
        }
    }
}

export default DataLoader;
