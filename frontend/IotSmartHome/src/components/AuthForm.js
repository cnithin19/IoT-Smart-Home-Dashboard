import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

export const AuthForm = ({ title, onSubmit, error, showRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>IOT Smart Home</Typography>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          {title}
        </Button>
      </form>
      {showRegister && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link to="/register">Don't have an account? Register</Link>
        </Box>
      )}
    </Box>
  );
};