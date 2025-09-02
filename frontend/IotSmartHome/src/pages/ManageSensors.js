
import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
// import { getCurrentUserId } from '../services/api';
// import { getSensors } from '../services/api';

// ...



export const ManageSensors = () => {

  const navigate = useNavigate();

  const sensors = useSelector((state) => state.sensors.sensors);

  const handleDelete = (id) => {
    // dispatch(deleteSensorAsync(id)); // Implement this thunk if you want to support sensor deletion
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>Manage Sensors</Typography>
      {sensors.length === 0 ? (
        <Typography color="text.secondary">No sensors found.</Typography>
      ) : (
        sensors.map((sensor) => (
          <Box key={sensor.id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#f9f9f9' }}>
            <Typography fontWeight={600}>Device {sensor.deviceId} ({sensor.type})</Typography>
            <Typography color="text.secondary">Value: {sensor.value}</Typography>
            <Typography color="text.secondary">Timestamp: {new Date(sensor.timestamp).toLocaleString()}</Typography>
            <IconButton color="error" onClick={() => handleDelete(sensor.id)}><DeleteIcon /></IconButton>
          </Box>
        ))
      )}
      <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
    </Paper>
  );
};
