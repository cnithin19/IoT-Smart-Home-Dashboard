// src/components/DeviceList.js
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchDevices,
  addDevice,
//  deleteDeviceAsync,
  controlLightAsync,
  controlThermostatAsync,
  controlAcAsync,
  controlFanAsync,
  controlDoorAsync,
} from '../redux/slices/devicesSlice';

/** --- helpers --- */
const parseStatus = (device) => {
  const type = device.type;
  const s = (device.status || '').toString();

  if (type === 'light') {
    return { on: s === 'on' };
  }

  if (type === 'door') {
    return { locked: s === 'locked' };
  }

  if (type === 'fan') {
    // "on-medium" | "off"
    if (!s || s === 'off') return { on: false, speed: 'medium' };
    const [, speed = 'medium'] = s.split('-');
    return { on: s.startsWith('on'), speed };
  }

  if (type === 'ac' || type === 'thermostat') {
    // "on-24-medium" | "off-24-medium"
    if (!s) return { on: false, temperature: 24, speed: 'medium' };
    const [power = 'off', t = '24', spd = 'medium'] = s.split('-');
    const temp = Number.isFinite(+t) ? +t : 24;
    return { on: power === 'on', temperature: temp, speed: spd || 'medium' };
  }

  return {};
};

const speedOrder = ['low', 'medium', 'high'];

/** --- UI bits --- */
// const Chip = ({ children, color = 'slate' }) => (
//   <span
//     className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800`}
//   >
//     {children}
//   </span>
// );

// const SectionCard = ({ title, children, right }) => (
//   <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-5">
//     <div className="flex items-center justify-between mb-4">
//       <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
//       {right}
//     </div>
//     {children}
//   </div>
// );

/** --- main component --- */
export const DeviceList = () => {
  const dispatch = useDispatch();
  const { devices, error } = useSelector((s) => s.devices);
  const [newDevice, setNewDevice] = useState({
    type: '',
    name: '',
    status: 'off',
    hasSensor: false,
    customCode: '',
  });

  // local control state (so sliders/buttons feel instant). We keep it in sync with Redux.
  const derived = useMemo(
    () =>
      Object.fromEntries(
        (devices || []).map((d) => [
          d.id,
          parseStatus(d), // {on, temperature, speed} etc.
        ])
      ),
    [devices]
  );
  const [localState, setLocalState] = useState(derived);
  useEffect(() => setLocalState(derived), [derived]);

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const setFor = (id, patch) =>
    setLocalState((s) => ({ ...s, [id]: { ...(s[id] || {}), ...patch } }));

  const handleAddDevice = () => {
    const base =
      newDevice.type === 'door'
        ? 'locked'
        : newDevice.type === 'fan'
        ? 'off'
        : newDevice.type === 'ac' || newDevice.type === 'thermostat'
        ? 'off-24-medium'
        : 'off';

    dispatch(
      addDevice({
        type: newDevice.type.trim(),
        name: newDevice.name.trim(),
        status: newDevice.status || base,
        hasSensor: !!newDevice.hasSensor,
        customCode: newDevice.customCode,
      })
    );
    setNewDevice({
      type: '',
      name: '',
      status: 'off',
      hasSensor: false,
      customCode: '',
    });
  };

  /** --- Device-specific dispatchers with correct payloads --- */
  const toggleLight = (d) => dispatch(controlLightAsync(d.id));

  const toggleDoor = (d) => dispatch(controlDoorAsync(d.id));

  const pushAcOrThermo = (d, state) => {
    const payload = {
      id: d.id,
      status: state.on ? 'on' : 'off',
      temperature: state.temperature ?? 24,
      speed: state.speed ?? 'medium',
    };
    if (d.type === 'ac') return dispatch(controlAcAsync(payload));
    return dispatch(controlThermostatAsync(payload));
  };

  const toggleAcOrThermo = (d) => {
    const st = localState[d.id] || parseStatus(d);
    const next = { ...st, on: !st.on };
    setFor(d.id, next);
    pushAcOrThermo(d, next);
  };

  const setTemp = (d, temperature) => {
    const st = { ...(localState[d.id] || parseStatus(d)), on: true, temperature };
    setFor(d.id, st);
    pushAcOrThermo(d, st);
  };

  const setSpeedAT = (d, speed) => {
    const st = { ...(localState[d.id] || parseStatus(d)), on: true, speed };
    setFor(d.id, st);
    pushAcOrThermo(d, st);
  };

  const toggleFan = (d) => {
    const st = localState[d.id] || parseStatus(d);
    const next = { ...st, on: !st.on };
    setFor(d.id, next);
    dispatch(
      controlFanAsync({
        id: d.id,
        status: next.on ? 'on' : 'off',
        speed: next.speed || 'medium',
      })
    );
  };

  const setSpeedFan = (d, speed) => {
    const st = { ...(localState[d.id] || parseStatus(d)), on: true, speed };
    setFor(d.id, st);
    dispatch(
      controlFanAsync({
        id: d.id,
        status: 'on',
        speed,
      })
    );
  };

  /** --- UI --- */
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md ring-1 ring-black/5 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Devices</h2>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {typeof error === 'string' ? error : error?.title || error?.status || 'An error occurred'}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {devices.map((d) => {
            const st = localState[d.id] || parseStatus(d);
            return (
              <div key={d.id} className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow p-5 ring-1 ring-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">{d.name} </h3>
                   
                    <span className="text-xs text-blue-700">({d.type} id:{d.id})</span>
                  </div>
                  <div className="flex gap-2">
                    {d.type === 'door' ? (
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${st.locked ? 'bg-violet-100 text-violet-800' : 'bg-amber-100 text-amber-800'}`}>
                        {st.locked ? 'Locked' : 'Unlocked'}
                      </span>
                    ) : st.on ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">On</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-800">Off</span>
                    )}
                    {d.hasSensor && <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-sky-100 text-sky-800">Sensor</span>}
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() =>
                      d.type === 'light'
                        ? toggleLight(d)
                        : d.type === 'door'
                        ? toggleDoor(d)
                        : d.type === 'fan'
                        ? toggleFan(d)
                        : toggleAcOrThermo(d)
                    }
                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium shadow ring-1 ${
                      (d.type === 'door' ? !st.locked : st.on)
                        ? 'bg-blue-100 text-blue-900 ring-blue-200 hover:bg-blue-200'
                        : 'bg-blue-900 text-white ring-blue-900/10 hover:bg-black'
                    }`}
                    title="Toggle power/lock"
                  >
                    {d.type === 'door'
                      ? st.locked
                        ? 'Unlock'
                        : 'Lock'
                      : st.on
                      ? 'Turn Off'
                      : 'Turn On'}
                  </button>
                </div>
                {(d.type === 'ac' || d.type === 'thermostat') && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-blue-700">Temperature</span>
                      <span className="font-semibold text-blue-900">{st.temperature ?? 24}°C</span>
                    </div>
                    <input
                      type="range"
                      min={16}
                      max={30}
                      step={1}
                      value={st.temperature ?? 24}
                      onChange={(e) => setTemp(d, Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-blue-700">Speed</span>
                      <div className="flex rounded-lg bg-blue-50 p-1">
                        {speedOrder.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSpeedAT(d, s)}
                            className={`px-3 py-1 text-xs font-medium rounded-md ${
                              (st.speed || 'medium') === s
                                ? 'bg-white text-blue-900 shadow ring-1 ring-blue-200'
                                : 'text-blue-600 hover:text-blue-800'
                            }`}
                          >
                            {s[0].toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {d.type === 'fan' && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Speed</span>
                      <div className="flex rounded-lg bg-blue-50 p-1">
                        {speedOrder.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSpeedFan(d, s)}
                            className={`px-3 py-1 text-xs font-medium rounded-md ${
                              (st.speed || 'medium') === s
                                ? 'bg-white text-blue-900 shadow ring-1 ring-blue-200'
                                : 'text-blue-600 hover:text-blue-800'
                            }`}
                          >
                            {s[0].toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-blue-700 truncate max-w-[60%]">
                    {d.customCode ? 'Custom code attached' : 'No custom code'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

            {/* Add Device */}
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type (light, ac, thermostat, fan, door)"
              value={newDevice.type}
              onChange={(e) => setNewDevice((s) => ({ ...s, type: e.target.value }))}
            />
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Name"
              value={newDevice.name}
              onChange={(e) => setNewDevice((s) => ({ ...s, name: e.target.value }))}
            />
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
                checked={newDevice.hasSensor}
                onChange={(e) =>
                  setNewDevice((s) => ({ ...s, hasSensor: e.target.checked }))
                }
              />
              Has Sensor
            </label>
            <div />
            <textarea
              className="md:col-span-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Custom Raspberry Pi code (optional)"
              value={newDevice.customCode}
              onChange={(e) =>
                setNewDevice((s) => ({ ...s, customCode: e.target.value }))
              }
            />
          </div>

          <div className="mt-3">
            <button
              onClick={handleAddDevice}
              disabled={!newDevice.type || !newDevice.name}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              + Add Device
            </button>
          </div>
        </div>
    </div>
  );
};

export default DeviceList;







// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchDevices, addDevice, deleteDeviceAsync, controlLightAsync, controlThermostatAsync, controlAcAsync, controlFanAsync, controlDoorAsync } from '../redux/slices/devicesSlice';
// import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Box, Typography, Alert, FormControlLabel, Checkbox, IconButton, Slider, Tooltip } from '@mui/material';
// import LightbulbIcon from '@mui/icons-material/Lightbulb';
// import AcUnitIcon from '@mui/icons-material/AcUnit';
// import AirIcon from '@mui/icons-material/Air';
// import LockIcon from '@mui/icons-material/Lock';
// import { useState } from 'react';

// export const DeviceList = () => {
//   const dispatch = useDispatch();
//   const { devices, error } = useSelector((state) => state.devices);
//   const [newDevice, setNewDevice] = useState({ type: '', name: '', status: 'off', hasSensor: false, customCode: '' });

//   useEffect(() => {
//     dispatch(fetchDevices());
//   }, [dispatch]);

//   const handleAddDevice = () => {
//     dispatch(addDevice({ type: newDevice.type, name: newDevice.name, status: newDevice.status, hasSensor: newDevice.hasSensor, customCode: newDevice.customCode }));
//     setNewDevice({ type: '', name: '', status: newDevice.type === 'door' ? 'locked' : 'off', hasSensor: false, customCode: '' });
//   };

//   const handleDeleteDevice = (id) => {
//     dispatch(deleteDeviceAsync(id));
//   };

//   const handleControlLight = (id) => {
//     dispatch(controlLightAsync(id));
//   };

//   const handleControlThermostat = (id, status, temperature, speed) => {
//     dispatch(controlThermostatAsync({ id, status, temperature, speed }));
//   };

//   const handleControlAc = (id, status, temperature, speed) => {
//     dispatch(controlAcAsync({ id, status, temperature, speed }));
//   };

//   const handleControlFan = (id, status, speed) => {
//     dispatch(controlFanAsync({ id, status, speed }));
//   };

//   const handleControlDoor = (id) => {
//     dispatch(controlDoorAsync(id));
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h5">Devices</Typography>
//       {error && <Alert severity="error">{error}</Alert>}
//       <Box sx={{ my: 2 }}>
//         <TextField
//           label="Type (light, ac, thermostat, fan, door)"
//           value={newDevice.type}
//           onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
//           sx={{ mr: 1 }}
//         />
//         <TextField
//           label="Name"
//           value={newDevice.name}
//           onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
//           sx={{ mr: 1 }}
//         />
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={newDevice.hasSensor}
//               onChange={(e) => setNewDevice({ ...newDevice, hasSensor: e.target.checked })}
//             />
//           }
//           label="Has Sensor"
//         />
//         <TextField
//           label="Custom Raspberry Pi Code"
//           multiline
//           rows={4}
//           value={newDevice.customCode}
//           onChange={(e) => setNewDevice({ ...newDevice, customCode: e.target.value })}
//           fullWidth
//           sx={{ mt: 1, mb: 1 }}
//         />
//         <Button variant="contained" onClick={handleAddDevice} disabled={!newDevice.type || !newDevice.name}>
//           Add Device
//         </Button>
//       </Box>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Icon</TableCell>
//             <TableCell>ID</TableCell>
//             <TableCell>Type</TableCell>
//             <TableCell>Name</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Has Sensor</TableCell>
//             <TableCell>Custom Code</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {devices.map((device) => (
//             <TableRow key={device.id}>
//               <TableCell>
//                 {device.type === 'light' && <LightbulbIcon />}
//                 {device.type === 'ac' && <AcUnitIcon />}
//                 {device.type === 'thermostat' && <AcUnitIcon />}
//                 {device.type === 'fan' && <AirIcon />}
//                 {device.type === 'door' && <LockIcon />}
//               </TableCell>
//               <TableCell>{device.id}</TableCell>
//               <TableCell>{device.type}</TableCell>
//               <TableCell>{device.name}</TableCell>
//               <TableCell>{device.status}</TableCell>
//               <TableCell>{device.hasSensor ? 'Yes' : 'No'}</TableCell>
//               <TableCell>
//                 <Tooltip title={device.customCode || 'No custom code'}>
//                   <span>{device.customCode ? 'View Code' : 'No Code'}</span>
//                 </Tooltip>
//               </TableCell>
//               <TableCell>
//                 {device.type === 'light' && (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleControlLight(device.id)}
//                     sx={{ mr: 1 }}
//                   >
//                     Toggle Light
//                   </Button>
//                 )}
//                 {(device.type === 'ac' || device.type === 'thermostat') && (
//                   <Box>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => (device.type === 'ac' ? handleControlAc : handleControlThermostat)(device.id, device.status.startsWith('on') ? 'off' : 'on', 24, 'medium')}
//                       sx={{ mr: 1 }}
//                     >
//                       Toggle {device.type === 'ac' ? 'AC' : 'Thermostat'}
//                     </Button>
//                     <Slider
//                       defaultValue={24}
//                       step={1}
//                       marks
//                       min={16}
//                       max={30}
//                       valueLabelDisplay="auto"
//                       onChange={(e, value) => (device.type === 'ac' ? handleControlAc : handleControlThermostat)(device.id, 'on', value, device.status.split('-')[2] || 'medium')}
//                       sx={{ width: 100, mr: 1 }}
//                     />
//                     <Slider
//                       defaultValue={2}
//                       step={1}
//                       marks={[{ value: 1, label: 'Low' }, { value: 2, label: 'Medium' }, { value: 3, label: 'High' }]}
//                       min={1}
//                       max={3}
//                       valueLabelDisplay="off"
//                       onChange={(e, value) => (device.type === 'ac' ? handleControlAc : handleControlThermostat)(device.id, 'on', device.status.split('-')[1] || 24, value === 1 ? 'low' : value === 2 ? 'medium' : 'high')}
//                       sx={{ width: 100 }}
//                     />
//                   </Box>
//                 )}
//                 {device.type === 'fan' && (
//                   <Box>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => handleControlFan(device.id, device.status.startsWith('on') ? 'off' : 'on', 'medium')}
//                       sx={{ mr: 1 }}
//                     >
//                       Toggle Fan
//                     </Button>
//                     <Slider
//                       defaultValue={2}
//                       step={1}
//                       marks={[{ value: 1, label: 'Low' }, { value: 2, label: 'Medium' }, { value: 3, label: 'High' }]}
//                       min={1}
//                       max={3}
//                       valueLabelDisplay="off"
//                       onChange={(e, value) => handleControlFan(device.id, 'on', value === 1 ? 'low' : value === 2 ? 'medium' : 'high')}
//                       sx={{ width: 100 }}
//                     />
//                   </Box>
//                 )}
//                 {device.type === 'door' && (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleControlDoor(device.id)}
//                     sx={{ mr: 1 }}
//                   >
//                     {device.status === 'locked' ? 'Unlock' : 'Lock'} Door
//                   </Button>
//                 )}
//                 <Button color="error" onClick={() => handleDeleteDevice(device.id)}>Delete</Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </Box>
//   );
// };