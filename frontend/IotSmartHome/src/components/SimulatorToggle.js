import { useState } from 'react';
import { toggleSimulator } from '../services/api';
import { Button, Box, Typography } from '@mui/material';

export const SimulatorToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = async () => {
    try {
      await toggleSimulator({ isEnabled: !isEnabled });
      setIsEnabled(!isEnabled);
    } catch (err) {
      console.error('Failed to toggle simulator:', err);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">IoT Simulator</Typography>
      <Button variant="contained" color={isEnabled ? 'error' : 'primary'} onClick={handleToggle}>
        {isEnabled ? 'Disable Simulator' : 'Enable Simulator'}
      </Button>
    </Box>
  );
};