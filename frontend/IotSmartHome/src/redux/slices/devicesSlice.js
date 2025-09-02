import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDevices, createDevice, updateDevice, deleteDevice, controlLight, controlThermostat, controlAc, controlFan, controlDoor, turnAllOn, turnAllOff } from '../../services/api';

export const fetchDevices = createAsyncThunk('devices/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await getDevices();
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch devices');
  }
});

export const addDevice = createAsyncThunk('devices/add', async (data, { rejectWithValue }) => {
  try {
    const response = await createDevice(data);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to add device');
  }
});

export const updateDeviceAsync = createAsyncThunk(
  'devices/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateDevice(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update device');
    }
  }
);

export const deleteDeviceAsync = createAsyncThunk('devices/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteDevice(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to delete device');
  }
});

export const controlLightAsync = createAsyncThunk(
  'devices/controlLight',
  async (id, { rejectWithValue }) => {
    try {
      const response = await controlLight(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to control light');
    }
  }
);

export const controlThermostatAsync = createAsyncThunk(
  'devices/controlThermostat',
  async ({ id, status, temperature, speed }, { rejectWithValue }) => {
    try {
      const response = await controlThermostat(id, { status, temperature, speed });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to control thermostat');
    }
  }
);

export const controlAcAsync = createAsyncThunk(
  'devices/controlAc',
  async ({ id, status, temperature, speed }, { rejectWithValue }) => {
    try {
      const response = await controlAc(id, { status, temperature, speed });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to control AC');
    }
  }
);

export const controlFanAsync = createAsyncThunk(
  'devices/controlFan',
  async ({ id, status, speed }, { rejectWithValue }) => {
    try {
      const response = await controlFan(id, { status, speed });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to control fan');
    }
  }
);

export const controlDoorAsync = createAsyncThunk(
  'devices/controlDoor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await controlDoor(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to control door');
    }
  }
);

export const turnAllOnAsync = createAsyncThunk('devices/turnAllOn', async (_, { rejectWithValue }) => {
  try {
    await turnAllOn();
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to turn all on');
  }
});

export const turnAllOffAsync = createAsyncThunk('devices/turnAllOff', async (_, { rejectWithValue }) => {
  try {
    await turnAllOff();
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to turn all off');
  }
});

const devicesSlice = createSlice({
  name: 'devices',
  initialState: { devices: [], error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.devices = action.payload;
        state.error = null;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.devices.push(action.payload);
        state.error = null;
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateDeviceAsync.fulfilled, (state, action) => {
        const index = state.devices.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.devices[index] = action.payload;
        state.error = null;
      })
      .addCase(updateDeviceAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteDeviceAsync.fulfilled, (state, action) => {
        state.devices = state.devices.filter((d) => d.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteDeviceAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(controlLightAsync.fulfilled, (state, action) => {
        const index = state.devices.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.devices[index] = action.payload;
        state.error = null;
      })
      .addCase(controlLightAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(controlThermostatAsync.fulfilled, (state, action) => {
        const index = state.devices.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.devices[index] = action.payload;
        state.error = null;
      })
      .addCase(controlThermostatAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(controlAcAsync.fulfilled, (state, action) => {
        const index = state.devices.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.devices[index] = action.payload;
        state.error = null;
      })
      .addCase(controlAcAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(controlFanAsync.fulfilled, (state, action) => {
        const index = state.devices.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.devices[index] = action.payload;
        state.error = null;
      })
      .addCase(controlFanAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(controlDoorAsync.fulfilled, (state, action) => {
        const index = state.devices.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.devices[index] = action.payload;
        state.error = null;
      })
      .addCase(controlDoorAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(turnAllOnAsync.fulfilled, (state) => {
        state.devices = state.devices.map(d => ({
          ...d,
          status: d.type === 'ac' || d.type === 'thermostat' ? 'on-24-medium' : d.type === 'fan' ? 'on-medium' : d.type === 'door' ? 'locked' : 'on'
        }));
        state.error = null;
      })
      .addCase(turnAllOnAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(turnAllOffAsync.fulfilled, (state) => {
        state.devices = state.devices.map(d => ({ ...d, status: d.type === 'door' ? 'locked' : 'off' }));
        state.error = null;
      })
      .addCase(turnAllOffAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default devicesSlice.reducer;