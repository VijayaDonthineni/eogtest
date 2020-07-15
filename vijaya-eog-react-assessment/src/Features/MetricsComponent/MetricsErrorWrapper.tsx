import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import MetricSubscriber from './MeasurementSubscriber';
import { Query } from 'urql';
import DashBoard from './DashBoard';
import { query } from './GQLQueries';


class MetricsErrorWrapper extends React.Component<{}, {}>{

    constructor(props: any) {
        super(props);
    }

    componentDidCatch() {
        return (
            <div>
                Error in metrics visualisation try in some time.......
            </div>
        )
    }

    render() {
        return (<div>
            <MetricSubscriber />
            <Query query={query} requestPolicy='network-only' >
                {queryResults => (
                    <DashBoard datafromurql={queryResults}></DashBoard>
                )}
            </Query>
        </div>
        )
    }

}

export default MetricsErrorWrapper;
