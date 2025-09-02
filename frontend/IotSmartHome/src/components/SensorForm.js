
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, InputAdornment, MenuItem } from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { createSensor } from '../services/api';

const sensorTypes = [
  { value: 'temperature', label: 'Temperature', icon: <DeviceThermostatIcon color="primary" /> },
  { value: 'humidity', label: 'Humidity', icon: <WaterDropIcon color="primary" /> },
  { value: 'motion', label: 'Motion', icon: <SensorsIcon color="primary" /> },
  { value: 'security', label: 'Security', icon: <SensorsIcon color="error" /> },
];

export const SensorForm = () => {
  const [form, setForm] = useState({ deviceId: '', type: '', value: '', location: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createSensor(form);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      setForm({ deviceId: '', type: '', value: '', location: '' });
    } catch (err) {
      setError('Failed to add sensor');
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4, borderRadius: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SensorsIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
        <Typography variant="h5" fontWeight={700} color="primary.main">Add Sensor</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Device ID"
          name="deviceId"
          value={form.deviceId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Sensor Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {sensorTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {option.icon}
                <Typography sx={{ ml: 1 }}>{option.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Value"
          name="value"
          value={form.value}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {form.type === 'temperature' && '°C'}
                {form.type === 'humidity' && '%'}
                {form.type === 'motion' && <SensorsIcon color="action" />}
                {form.type === 'security' && <SensorsIcon color="error" />}
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: 16, borderRadius: 2 }}
        >
          Add Sensor
        </Button>
        {submitted && (
          <Typography color="success.main" sx={{ mt: 2, textAlign: 'center' }}>
            Sensor added successfully!
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </form>
    </Paper>
  );
};
