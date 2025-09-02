import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDeviceAsync, deleteDeviceAsync, fetchDevices } from '../redux/slices/devicesSlice';
import { Box, Typography, Paper, TextField, Button, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ManageDevices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const devices = useSelector((state) => state.devices.devices);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', status: '', customCode: '' });

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const handleEdit = (device) => {
    setEditId(device.id);
    setEditForm({ name: device.name, status: device.status, customCode: device.customCode || '' });
  };

  const handleUpdate = async (id) => {
    await dispatch(updateDeviceAsync({ id, data: editForm }));
    setEditId(null);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteDeviceAsync(id));
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>Manage Devices</Typography>
      {devices.length === 0 ? (
        <Typography color="text.secondary">No devices found.</Typography>
      ) : (
        devices.map((device) => (
          <Box key={device.id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#f9f9f9' }}>
            {editId === device.id ? (
              <>
                <TextField label="Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} sx={{ mr: 2 }} />
                <TextField label="Status" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} sx={{ mr: 2 }} />
                <TextField label="Custom Code" value={editForm.customCode} onChange={e => setEditForm({ ...editForm, customCode: e.target.value })} sx={{ mr: 2 }} />
                <Button variant="contained" color="primary" onClick={() => handleUpdate(device.id)} sx={{ mr: 1 }}>Save</Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditId(null)}>Cancel</Button>
              </>
            ) : (
              <>
                <Typography fontWeight={600}>{device.name} ({device.type})</Typography>
                <Typography color="text.secondary">Status: {device.status}</Typography>
                <Typography color="text.secondary">Has Sensor: {device.hasSensor ? 'Yes' : 'No'}</Typography>
                <Typography color="text.secondary">Custom Code: {device.customCode || 'None'}</Typography>
                <IconButton color="primary" onClick={() => handleEdit(device)} sx={{ mr: 1 }}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(device.id)}><DeleteIcon /></IconButton>
              </>
            )}
          </Box>
        ))
      )}
      <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
    </Paper>
  );
};
