using IOTsmartHome.Hubs;
using IOTsmartHome.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace IOTsmartHome.Services
{
    public class IoTSimulatorService : BackgroundService
    {
        private readonly IHubContext<SensorHub> _hubContext;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<IoTSimulatorService> _logger;

        public IoTSimulatorService(IHubContext<SensorHub> hubContext, IServiceScopeFactory scopeFactory, ILogger<IoTSimulatorService> logger)
        {
            _hubContext = hubContext;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("IoTSimulatorService started at {Time}", DateTime.UtcNow);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                        // Step 1: Find a user
                        var user = await context.Users.FirstOrDefaultAsync(stoppingToken);
                        if (user == null)
                        {
                            _logger.LogWarning("No users found in the database. Please register a user via /api/auth/register. Skipping sensor data generation.");
                            await Task.Delay(10000, stoppingToken); // Wait longer before retrying
                            continue;
                        }
                        _logger.LogInformation("Found user: {Username} (Id: {UserId})", user.Username, user.Id);

                        // Step 2: Find or create a device for this user
                        var device = await context.Devices
                            .FirstOrDefaultAsync(d => d.UserId == user.Id, stoppingToken);
                        if (device == null)
                        {
                            _logger.LogInformation("No devices found for UserId {UserId}. Creating a default device.", user.Id);
                            device = new Device
                            {
                                UserId = user.Id,
                                Type = "light",
                                Name = "Simulator Light",
                                Status = "off"
                            };
                            context.Devices.Add(device);
                            await context.SaveChangesAsync(stoppingToken);
                            _logger.LogInformation("Created device: {Name} (Id: {DeviceId}) for UserId {UserId}", device.Name, device.Id, user.Id);
                        }
                        else
                        {
                            _logger.LogInformation("Using existing device: {Name} (Id: {DeviceId}) for UserId {UserId}", device.Name, device.Id, user.Id);
                        }

                        // Step 3: Add sensor reading
                        var temp = new Random().Next(18, 30);
                        var sensor = new Sensor
                        {
                            Type = "temperature",
                            Value = temp,
                            DeviceId = device.Id,
                            Timestamp = DateTime.UtcNow
                        };
                        context.Sensors.Add(sensor);
                        await context.SaveChangesAsync(stoppingToken);
                        _logger.LogInformation("Saved sensor reading: DeviceId={DeviceId}, Type={Type}, Value={Value}, Timestamp={Timestamp}",
                            sensor.DeviceId, sensor.Type, sensor.Value, sensor.Timestamp);

                        // Step 4: Broadcast via SignalR
                        await _hubContext.Clients.All.SendAsync("ReceiveSensorUpdate", sensor.Type, sensor.Value, stoppingToken);
                        if (temp > 28)
                        {
                            await _hubContext.Clients.All.SendAsync("ReceiveAlert", "It's too hot!", stoppingToken);
                            _logger.LogWarning("High temperature alert: {Value}°C for DeviceId {DeviceId}", temp, device.Id);
                        }
                    }
                }
                catch (DbUpdateException ex) when (ex.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx && sqlEx.Number == 547)
                {
                    _logger.LogError(ex, "Foreign key constraint violation while saving sensor for DeviceId. Ensure Devices table has valid data.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Unexpected error in IoTSimulatorService while processing sensor data.");
                }

                await Task.Delay(500000, stoppingToken);
            }

            _logger.LogInformation("IoTSimulatorService stopped at {Time}", DateTime.UtcNow);
        }
    }
}