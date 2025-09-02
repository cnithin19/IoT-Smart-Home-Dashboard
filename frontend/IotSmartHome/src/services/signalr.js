import * as signalR from '@microsoft/signalr';
import { store } from '../redux/store';
import { addSensor, setAlert } from '../redux/slices/sensorsSlice';

export const initSignalR = () => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7238/hubs/sensors', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build();

  connection.on('ReceiveSensorUpdate', (type, value) => {
    if (type === 'temperature') {
      store.dispatch(
        addSensor({
          id: Date.now(),
          deviceId: 1,
          type,
          value,
          timestamp: new Date().toISOString(),
        })
      );
    }
  });

  connection.on('ReceiveAlert', (message) => {
    store.dispatch(setAlert(message));
  });

  connection.start().catch((err) => console.error('SignalR Connection Error:', err));

  return connection;
};