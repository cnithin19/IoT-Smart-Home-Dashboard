import React, { useState } from 'react';
import {  Typography, TextField, Button, Paper, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { addDevice } from '../redux/slices/devicesSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const AddDevice = () => {
  const [form, setForm] = useState({ type: '', name: '', status: '', hasSensor: false, customCode: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For hasSensor, convert string to boolean
    if (name === 'hasSensor') {
      setForm({ ...form, hasSensor: value === 'true' });
    } else if (name === 'type') {
      // Set default status based on type
      let status = '';
      if (value === 'door') status = 'locked';
      else status = 'off';
      setForm({ ...form, type: value, status });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addDevice(form));
    navigate('/dashboard');
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>Add Device</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="ac">AC</MenuItem>
          <MenuItem value="thermostat">Thermostat</MenuItem>
          <MenuItem value="fan">Fan</MenuItem>
          <MenuItem value="door">Door</MenuItem>
        </TextField>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField
          label={form.type === 'door' ? 'Status (locked/unlocked)' : 'Status (on/off)'}
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          disabled={form.type !== 'door'}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="has-sensor-label">Has Sensor</InputLabel>
          <Select
            labelId="has-sensor-label"
            name="hasSensor"
            value={form.hasSensor ? 'true' : 'false'}
            label="Has Sensor"
            onChange={handleChange}
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Custom Raspberry Pi Code" name="customCode" value={form.customCode} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Add Device</Button>
      </form>
    </Paper>
  );
};
