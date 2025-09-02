using IOTsmartHome.Hubs;
using IOTsmartHome.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace IOTsmartHome.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/control")]
    public class ControlsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<SensorHub> _hubContext;

        public ControlsController(AppDbContext context, IHubContext<SensorHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("light/{id}")]
        public async Task<IActionResult> ToggleLight(int id, [FromBody] bool onOff)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null) return NotFound("No device found!");
            device.Status = onOff ? "on" : "off";
            await _context.SaveChangesAsync();
            // Shout the update to everyone
            await _hubContext.Clients.All.SendAsync("DeviceUpdated", device);
            return Ok("Light changed!");
        }
        // Add for thermostat and door too
    }
}
