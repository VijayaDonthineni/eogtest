import React, { useEffect } from 'react';
import { IState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { actions as metricactions } from './reducer'
import { Query } from 'urql';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import MetricChart from './Chart';
import { HistoryData } from './GQLQueries';

interface props {
    datafromurql: any;
}

interface MeasurementQuery {
    metricName: string,
    after: number,
    before: number;
}

const DashBoard: React.FC<props> = (props) => {

    const datafromurql = props.datafromurql;
    const metricNames: string[] = ['select...'];
    const [selectedFilter] = React.useState('select...');
    const dispatch = useDispatch();

    const getSelectedMetrics = (state: IState) => {
        return { selectedMetrics: state.metric.SelectedMetrics };
    }

    const getCurrentMetrics = (state: IState) => {
        return { metric: state.metric.CurrentMetrics };
    }

    const getInputs = (state: IState) => {
        let inputs: MeasurementQuery[] = [];
        let dateval = new Date().getTime();
        let after = dateval - 1800 * 1000;
        for (const iterator of state.metric.SelectedMetrics) {
            inputs.push({ metricName: iterator, after: after, before: dateval });
        }
        return {
            inputs
        };
    }

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        dispatch(metricactions.metricSelected({ selectedMetric: event.target.value as string }));
    };

    const { selectedMetrics } = useSelector(getSelectedMetrics);
    const { inputs } = useSelector(getInputs);
    const { metric } = useSelector(getCurrentMetrics);

    if (!datafromurql.fetching && metricNames.length <= 1) {
        for (const iterator of datafromurql.data.getMetrics) {
            metricNames.push(iterator);
        }
    }

    useEffect(() => {

    }, [selectedMetrics]);

    return (
        <React.Fragment>
            <div style={{ padding: '10px', float: 'left' }}>
                {metricNames !== undefined && metricNames.length > 0 &&
                    <Select
                        labelId="metrics-label"
                        id="metrics"
                        value={selectedFilter}
                        onChange={handleChange}
                    >
                        {metricNames.map(x => (
                            <MenuItem key={x} value={x} >{x}</MenuItem>
                        ))}
                    </Select>}
            </div>

            <div>
                {selectedMetrics.map(x => (
                    <div style={{ width: '120px', height: '120px', background: '#fff', border: '2px solid #ddd', display: 'inline-block' }}>
                        <div style={{ display: 'inline-block', padding: '4px', margin: '6px' }} >{x}</div>
                        <div style={{ padding: '20px' }}>
                            {metric !== undefined && metric[x] !== undefined && metric[x].value}
                        </div>
                    </div>
                ))}
            </div>

            <div>
                {selectedMetrics.length > 0 && <Query query={HistoryData} variables={{ inputs }} requestPolicy='network-only' >
                    {queryResults => (
                        <MetricChart datafromurql={queryResults} ></MetricChart>
                    )}
                </Query>}
            </div>
        </React.Fragment>
    );
}

export default DashBoard;