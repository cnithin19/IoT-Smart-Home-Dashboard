import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AddDevice } from './pages/AddDevice';
import { AddSensor } from './pages/AddSensor';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ManageDevices } from './pages/ManageDevices';
import { ManageSensors } from './pages/ManageSensors';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
});

export default function App() {
  const isAuthenticated = !!useSelector((state) => state.auth.token);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/add-device" element={isAuthenticated ? <AddDevice /> : <Navigate to="/login" />} />
          <Route path="/add-sensor" element={isAuthenticated ? <AddSensor /> : <Navigate to="/login" />} />
          <Route path="/manage-devices" element={isAuthenticated ? <ManageDevices /> : <Navigate to="/login" />} />
          <Route path="/manage-sensors" element={isAuthenticated ? <ManageSensors /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
