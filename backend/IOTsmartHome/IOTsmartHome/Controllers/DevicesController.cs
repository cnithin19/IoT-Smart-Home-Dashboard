using IOTsmartHome.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace IOTsmartHome.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DevicesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDevices()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return BadRequest("No userId found in token!");

            var userId = int.Parse(userIdClaim);

            var devices = await _context.Devices
                .Where(d => d.UserId == userId)
                .ToListAsync();

            return Ok(devices);
        }

        [HttpPost]
        public async Task<IActionResult> AddDevice([FromBody] DeviceDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Type) || string.IsNullOrEmpty(dto.Name))
                return BadRequest("Need a type and name for the new Device!");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return BadRequest("No userId found in token!");

            var userId = int.Parse(userIdClaim);

            var device = new Device
            {
                UserId = userId,
                Type = dto.Type,
                Name = dto.Name,
                Status = dto.Status ?? "off",
                CustomCode = dto.CustomCode,
                HasSensor = dto.HasSensor
            };

            _context.Devices.Add(device);
            await _context.SaveChangesAsync();
            return Ok(device);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDevice(int id, [FromBody] DeviceUpdateRequest request)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null) return NotFound();

            device.Type = request.Type ?? device.Type;
            device.Name = request.Name ?? device.Name;
            device.Status = request.Status ?? device.Status;
            device.HasSensor = request.HasSensor ?? device.HasSensor;
            device.CustomCode = request.CustomCode ?? device.CustomCode;

            await _context.SaveChangesAsync();
            return Ok(device);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevice(int id)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null) return NotFound();

            _context.Devices.Remove(device);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("control/light/{id}")]
        public async Task<IActionResult> ControlLight(int id)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null || device.Type != "light") return NotFound();

            device.Status = device.Status == "on" ? "off" : "on";
            await _context.SaveChangesAsync();
            return Ok(device);
        }

        [HttpPost("control/thermostat/{id}")]
        public async Task<IActionResult> ControlThermostat(int id, [FromBody] AcControlRequest request)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null || device.Type != "thermostat") return NotFound();

            device.Status = $"{request.Status}-{request.Temperature}-{request.Speed}";
            await _context.SaveChangesAsync();
            return Ok(device);
        }

        [HttpPost("control/ac/{id}")]
        public async Task<IActionResult> ControlAc(int id, [FromBody] AcControlRequest request)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null || device.Type != "ac") return NotFound();

            device.Status = $"{request.Status}-{request.Temperature}-{request.Speed}";
            await _context.SaveChangesAsync();
            return Ok(device);
        }

        [HttpPost("control/fan/{id}")]
        public async Task<IActionResult> ControlFan(int id, [FromBody] FanControlRequest request)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null || device.Type != "fan") return NotFound();

            device.Status = $"{request.Status}-{request.Speed}";
            await _context.SaveChangesAsync();
            return Ok(device);
        }

        [HttpPost("control/door/{id}")]
        public async Task<IActionResult> ControlDoor(int id)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null || device.Type != "door") return NotFound();

            device.Status = device.Status == "locked" ? "unlocked" : "locked";
            await _context.SaveChangesAsync();
            return Ok(device);
        }
 


        [HttpPost("control/all/on")]
        public async Task<IActionResult> TurnAllOn()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var devices = await _context.Devices.Where(d => d.UserId == userId).ToListAsync();

            foreach (var device in devices)
            {
                if (device.Type == "ac" || device.Type == "thermostat")
                    device.Status = "on-24-medium";
                else if (device.Type == "fan")
                    device.Status = "on-medium";
                else if (device.Type == "door")
                    device.Status = "locked";
                else
                    device.Status = "on";
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("control/all/off")]
        public async Task<IActionResult> TurnAllOff()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var devices = await _context.Devices.Where(d => d.UserId == userId).ToListAsync();

            foreach (var device in devices)
                device.Status = device.Type == "door" ? "locked" : "off";

            await _context.SaveChangesAsync();
            return Ok();
        }
    }

    // DTOs
    public class DeviceCreateRequest
    {
        public string? Type { get; set; }
        public string? Name { get; set; }
        public string? Status { get; set; }
        public bool? HasSensor { get; set; }
        public string? CustomCode { get; set; }
    }

    public class DeviceUpdateRequest
    {
        public string? Type { get; set; }
        public string? Name { get; set; }
        public string? Status { get; set; }
        public bool? HasSensor { get; set; }
        public string? CustomCode { get; set; }
    }

    public class AcControlRequest
    {
        public string? Status { get; set; }
        public int? Temperature { get; set; }
        public string? Speed { get; set; }
    }

    public class FanControlRequest
    {
        public string? Status { get; set; }
        public string? Speed { get; set; }
    }
}
