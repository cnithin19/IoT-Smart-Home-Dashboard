import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5141/api', // Ensure correct backend URL
});



api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found in localStorage');
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
export function getCurrentUserId() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload["nameid"] || payload["sub"] || '';
    }
  } catch (e) {}
  return '';
}
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getDevices = () => api.get('/devices');
export const createDevice = (data) => api.post('/devices', data);
export const updateDevice = (id, data) => api.put(`/devices/${id}`, data);
export const deleteDevice = (id) => api.delete(`/devices/${id}`);
export const controlLight = (id) => api.post(`/devices/control/light/${id}`);
export const controlThermostat = (id, data) => api.post(`/control/thermostat/${id}`, data);
export const controlAc = (id, data) => api.post(`/devices/control/ac/${id}`, data);
export const controlFan = (id, data) => api.post(`/devices/control/fan/${id}`, data);
export const controlDoor = (id) => api.post(`/devices/control/door/${id}`);
export const turnAllOn = () => api.post('/devices/control/all/on');
export const turnAllOff = () => api.post('/devices/control/all/off');
export const getSensors = () => api.get('/sensors');
export const createSensor = (data) => api.post('/sensors', data);
export const getTemperatureSensors = () => api.get('/sensors/temperature');
export const getSecuritySensors = () => api.get('/sensors/security');
export const toggleSimulator = (data) => api.post('/simulator/toggle', data);

