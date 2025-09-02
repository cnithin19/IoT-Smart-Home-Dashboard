import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTemperatureSensors } from '../../services/api';

export const fetchSensors = createAsyncThunk('sensors/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await getTemperatureSensors();
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch sensors');
  }
});

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState: { sensors: [], alert: null },
  reducers: {
    addSensor: (state, action) => {
      state.sensors = [action.payload, ...state.sensors.slice(0, 99)];
    },
    setAlert: (state, action) => {
      state.alert = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSensors.fulfilled, (state, action) => {
        state.sensors = action.payload;
        state.alert = null;
      })
      .addCase(fetchSensors.rejected, (state, action) => {
        state.alert = action.payload;
      });
  },
});

export const { addSensor, setAlert } = sensorsSlice.actions;
export default sensorsSlice.reducer;