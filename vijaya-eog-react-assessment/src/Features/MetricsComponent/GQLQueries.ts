export const query = `
  {
    getMetrics
   }
  `;

export const HistoryData = `
  query($inputs : [MeasurementQuery]) {
    getMultipleMeasurements(input: $inputs) {
    metric,
    measurements{
    at,
    value,
    unit
    }
  }
  }
  `;

export const subscriptionForMetrics = `
subscription {
  newMeasurement {metric, at, value, unit}
}
`;