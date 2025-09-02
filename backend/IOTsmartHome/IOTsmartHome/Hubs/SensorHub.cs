using Microsoft.AspNetCore.SignalR;

namespace IOTsmartHome.Hubs
{
    public class SensorHub:Hub
    {
      //  public object Clients { get; private set; }

        public async Task SendSensorUpdate(string type, object data)
        {
            await Clients.All.SendAsync("ReceiveSensorUpdate", type, data);
        }
    }
}
