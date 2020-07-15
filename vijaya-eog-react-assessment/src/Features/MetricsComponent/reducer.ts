import { createSlice, PayloadAction } from 'redux-starter-kit';


export type MetricNames = {
  Names: string[];
}

export type MetricSelected = {
  selectedMetric: string;
}

export type Metric = {
  metricName: string,
  metricValue: metricDetails
};

export type metricDetails = {
  metric: string,
  value: number,
  unit: string,
  at: number
}

export type metricMeasurement = {
  metricName: string;
  measurements: metricMeasurement[];
}

export type multipleMeasurement = {
  multipleMetrics: metricMeasurement[];
}

interface IState {
  AvailableMetrics: string[],
  SelectedMetrics: string[],
  CurrentMetrics: { [key: string]: metricDetails },
  PastMetrics: { [key: string]: metricDetails[] }
}

const initialState: IState = {
  AvailableMetrics: [],
  SelectedMetrics: [],
  CurrentMetrics: {},
  PastMetrics: {}
};

const slice = createSlice({
  name: 'metric',
  initialState,
  reducers: {

    metricNamesReceived: (state, action: PayloadAction<MetricNames>) => {
      let metrics: string[] = [];
      for (const item of action.payload.Names) {
        state.AvailableMetrics.push(item);
      }
    },

    metricSelected: (state, action: PayloadAction<MetricSelected>) => {
      if (action.payload.selectedMetric !== 'select...' &&
        state.SelectedMetrics.find((val, index) => val === action.payload.selectedMetric) === undefined) {
        state.SelectedMetrics.push(action.payload.selectedMetric);
      }
    },

    metricUnselected: (state, action: PayloadAction<MetricSelected>) => {
      if (state.SelectedMetrics.find((val, index) => val === action.payload.selectedMetric) !== undefined) {
        let index = state.SelectedMetrics.findIndex((x, y) => x === action.payload.selectedMetric);
        state.SelectedMetrics.splice(index, 1);
      }
      state.PastMetrics[action.payload.selectedMetric] = [];
    },

    metricDataReceived: (state, action: PayloadAction<Metric>) => {
      state.CurrentMetrics[action.payload.metricName] = action.payload.metricValue;
      if (state.PastMetrics[action.payload.metricName] === undefined) {
        state.PastMetrics[action.payload.metricName] = [];
      }
      state.PastMetrics[action.payload.metricName].push(action.payload.metricValue);
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
