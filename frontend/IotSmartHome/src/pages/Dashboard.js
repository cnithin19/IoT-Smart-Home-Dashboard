import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSensors } from '../redux/slices/sensorsSlice';
import { initSignalR } from '../services/signalr';
import { DeviceList } from '../components/DeviceList';
//import { SensorForm } from '../components/SensorForm';
import { SensorChart } from '../components/SensorChart';
//import { SimulatorToggle } from '../components/SimulatorToggle';
import { logout } from '../redux/slices/authSlice';
import { turnAllOnAsync, turnAllOffAsync } from '../redux/slices/devicesSlice';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alert } = useSelector((state) => state.sensors);

  useEffect(() => {
    dispatch(fetchSensors());
    const connection = initSignalR();
    return () => {
      connection.stop();
    };
  }, [dispatch]);

  let username = '';
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.sub;
    }
  } catch (e) {
    username = '';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">IOT Smart Home Dashboard</h1>
            <p className="text-lg text-gray-300">Welcome, <span className="font-semibold">{username}</span></p>
          </div>
          <button
            onClick={() => {
              dispatch(logout());
              navigate('/login');
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Add/Manage Device/Sensor Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate('/add-device')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            Add Device
          </button>
          <button
            onClick={() => navigate('/add-sensor')}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600"
          >
            Add Sensor
          </button>
          <button
            onClick={() => navigate('/manage-devices')}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600"
          >
            Manage Devices
          </button>
          <button
            onClick={() => navigate('/manage-sensors')}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
          >
            Manage Sensors
          </button>
        </div>

        {/* Device Control */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Device Control</h2>
          <div className="flex gap-3">
            <button
              onClick={() => dispatch(turnAllOnAsync())}
              className="px-4 py-2  bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            >
              Turn All On
            </button>
            <button
              onClick={() => dispatch(turnAllOffAsync())}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            >
              Turn All Off
            </button>
          </div>
        </div>

        {alert && (
          <div className="mb-6 p-3 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded-lg">
            {alert}
          </div>
        )}

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <DeviceList />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            {/* <SensorForm /> */}
            <SensorChart />
          </div>
        </div>
      </div>
    </div>
  );
};





// import {  useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchSensors } from '../redux/slices/sensorsSlice';
// import { initSignalR } from '../services/signalr';
// import { DeviceList } from '../components/DeviceList';
// import { SensorForm } from '../components/SensorForm';
// import { SensorChart } from '../components/SensorChart';
// import { SimulatorToggle } from '../components/SimulatorToggle';
// import { Button, Box, Typography, Alert } from '@mui/material';
// import { logout } from '../redux/slices/authSlice';
// import { turnAllOnAsync, turnAllOffAsync } from '../redux/slices/devicesSlice';

// import { useNavigate } from 'react-router-dom';

// export const Dashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { alert } = useSelector((state) => state.sensors);

//   useEffect(() => {
//     dispatch(fetchSensors());
//     const connection = initSignalR();
//     return () => {
//       connection.stop();
//     };
//   }, [dispatch]);

//   // Decode username from JWT token
//   let username = '';
//   try {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       username = payload.sub;
//     }
//   } catch (e) {
//     username = '';
//   }

//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h4">IOT Smart Home Dashboard</Typography>
//       <Typography variant="subtitle1" sx={{ mb: 2 }}>Welcome, {username}</Typography>
//       <Button
//         variant="outlined"
//         color="error"
//         onClick={() => {
//           dispatch(logout());
//           navigate('/login');
//         }}
//         sx={{ mb: 2 }}
//       >
//         Logout
//       </Button>
//       <Box sx={{ mb: 2 }}>
        
//         <Typography variant="h5">Device Control</Typography>
//         <Button
//           variant="contained"
//           color="success"
//           onClick={() => dispatch(turnAllOnAsync())}
//           sx={{ mr: 1 }}
//         >
//           Turn All On
//         </Button>
//         <Button
//           variant="contained"
//           color="error"
//           onClick={() => dispatch(turnAllOffAsync())}
//         >
//           Turn All Off
//         </Button>
//       </Box>
//       {alert && <Alert severity="warning">{alert}</Alert>}
//       <SimulatorToggle />
//       <DeviceList />
//       <SensorForm />
//       <SensorChart />
//     </Box>
//   );
// };