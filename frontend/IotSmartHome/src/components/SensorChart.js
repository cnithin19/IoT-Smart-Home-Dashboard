import { useSelector, useDispatch } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { useEffect , useState} from 'react';
import { addSensor } from '../redux/slices/sensorsSlice';
//import { getTemperatureSensors } from "../services/api";
import { getSecuritySensors } from "../services/api";

Chart.register(...registerables);

export const SensorChart = () => {
  const dispatch = useDispatch();
  const { sensors } = useSelector((state) => state.sensors);
  const devices = useSelector((state) => state.devices.devices);
  const [sensorss, setSensors] = useState([]);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSecuritySensors();
        setSensors(res.data);
      } catch (err) {
        console.error("Failed to fetch security sensors", err);
      }
    };
    fetchData();
  }, []);

  //  const [sensorsss, setSensorss] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await getTemperatureSensors();
  //       setSensorss(res.data);
  //     } catch (err) {
  //       console.error("Failed to fetch temperature sensors", err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    // Simulate random temperatures and security alerts if simulator is enabled
    const interval = setInterval(() => {
      const randomTemp = 18 + Math.random() * 12; // 18-30°C
      dispatch(
        addSensor({
          id: Date.now(),
          deviceId: 1,
          type: 'temperature',
          value: randomTemp,
          timestamp: new Date().toISOString(),
        })
      );
      if (Math.random() < 0.1) { // 10% chance for security alert
        dispatch(
          addSensor({
            id: Date.now() + 1,
            deviceId: 1,
            type: 'security',
            value: Math.random() < 0.5 ? 'Security Alert' : 'Security OK',
            timestamp: new Date().toISOString(),
          })
        );
      }
    }, 50000); // Every 5 seconds
    return () => clearInterval(interval);
  }, [dispatch]);

  const data = {
    labels: sensors.map((s) => new Date(s.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: sensors.filter(s => s.type === 'temperature').map((s) => s.value),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        fill: true,
      },
      {
        label: 'Security Alerts',
        data: sensors.filter(s => s.type === 'security').map((s) => s.value === 'Security Alert' ? 1 : 0),
        borderColor: '#d32f2f',
        backgroundColor: 'rgba(211, 47, 47, 0.2)',
        fill: false,
      },
    ],
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)', borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 2 }}>Security Sensors</Typography>
        {sensorss.length === 0 ? (
          <Typography color="text.secondary">No security sensor data available.</Typography>
        ) : (
          sensorss.map((s) => {
            const device = devices.find(d => d.id === s.deviceId);
            const deviceName = device ? device.name : `Device ${s.deviceId}`;
            return (
              <Box key={s.id} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={`${deviceName} (${s.type})`}
                  color={s.value === 1 ? 'error' : 'success'}
                  sx={{ mr: 2 }}
                />
                <Typography color={s.value === 1 ? 'error.main' : 'success.main'} fontWeight={600}>
                  {s.value === 1 ? 'Motion Detected 🚨' : 'No Motion ✅'}
                </Typography>
                <Typography color="text.secondary" sx={{ ml: 2, fontSize: 13 }}>
                  {new Date(s.timestamp).toLocaleString()}
                </Typography>
              </Box>
            );
          })
        )}
      </Paper>

      {/* Temperature Sensors (uncomment if needed) */}
      {/* <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #fffde7 0%, #fff 100%)', borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 2 }}>Temperature Sensors</Typography>
        {sensorsss.length === 0 ? (
          <Typography color="text.secondary">No temperature sensor data available.</Typography>
        ) : (
          sensorsss.map((s) => (
            <Box key={s.id} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Chip label={`Device ${s.deviceId}`} color="primary" sx={{ mr: 2 }} />
              <Typography color="primary.main" fontWeight={600}>{s.value}°C</Typography>
              <Typography color="text.secondary" sx={{ ml: 2, fontSize: 13 }}>{new Date(s.timestamp).toLocaleString()}</Typography>
            </Box>
          ))
        )}
      </Paper> */}

      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)' }}>
        <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 2 }}>Sensor Readings</Typography>
        <Line data={data} options={{
          plugins: {
            legend: {
              labels: {
                color: '#1976d2',
                font: { size: 14, weight: 'bold' }
              }
            }
          },
          scales: {
            x: {
              ticks: { color: '#1976d2', font: { size: 13 } },
              grid: { color: 'rgba(25, 118, 210, 0.1)' }
            },
            y: {
              ticks: { color: '#1976d2', font: { size: 13 } },
              grid: { color: 'rgba(25, 118, 210, 0.1)' }
            }
          }
        }} />
      </Paper>
    </>
  );
};