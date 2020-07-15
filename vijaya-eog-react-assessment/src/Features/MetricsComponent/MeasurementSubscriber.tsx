import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actions as metricactions } from './reducer'
import { useSubscription } from 'urql';
import { subscriptionForMetrics } from './GQLQueries';


const MeasurementSubscriber: React.FC<{}> = () => {

  const [subscriptionResponse] = useSubscription({ query: subscriptionForMetrics });
  const { fetching, data, error } = subscriptionResponse;
  const dispatch = useDispatch();

  useEffect(() => {

    if (error) {
      return;
    }

    if (!data) return;

    const { newMeasurement } = data;

    dispatch(metricactions.metricDataReceived({ metricName: newMeasurement["metric"], metricValue: newMeasurement }));

  }, [dispatch, data, error, fetching]);

  return null;

}

export default MeasurementSubscriber;
