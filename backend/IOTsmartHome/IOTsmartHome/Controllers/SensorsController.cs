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
    public class SensorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SensorsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Get all sensors
        //[HttpGet]
        //public async Task<IActionResult> GetSensors()
        //{
        //    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        //    var sensors = await _context.Sensors
        //        .Include(s => s.Device)
        //        .Where(s => s.Device.UserId == userId)
        //        .ToListAsync();

        //    return Ok(sensors);
        //}


        [HttpGet]
        public async Task<IActionResult> GetAllSensors()
        {
            var sensors = await _context.Sensors.Include(s => s.Device).ToListAsync();
            return Ok(sensors);
        }

        // ✅ Get sensors for one device
        [HttpGet("{deviceId}")]
        public async Task<IActionResult> GetSensorsByDevice(int deviceId)
        {
            var sensors = await _context.Sensors
                .Where(s => s.DeviceId == deviceId)
                .ToListAsync();

            if (!sensors.Any())
                return NotFound("No sensors found for this device.");

            return Ok(sensors);
        }

        // ✅ Filter only temperature sensors
        [HttpGet("temperature")]
        public async Task<IActionResult> GetTemperatureSensors()
        {
            var sensors = await _context.Sensors
                .Where(s => s.Type.ToLower() == "temperature")
                .OrderByDescending(s => s.Timestamp)
                .ToListAsync();

            return Ok(sensors);
        }

        // ✅ Filter only security sensors
        [HttpGet("security")]
        public async Task<IActionResult> GetSecuritySensors()
        {
            var sensors = await _context.Sensors
                .Where(s => s.Type.ToLower() == "security")
                .OrderByDescending(s => s.Timestamp)
                .ToListAsync();

            return Ok(sensors);
        }

        // ✅ Add a new sensor reading
        [HttpPost]
        public async Task<IActionResult> AddSensor([FromBody] SensorDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Type))
                return BadRequest("Sensor type and device required.");

            var sensor = new Sensor
            {
                DeviceId = dto.DeviceId,
                Type = dto.Type,
                Value = dto.Value,
                Timestamp = DateTime.UtcNow
            };

            _context.Sensors.Add(sensor);
            await _context.SaveChangesAsync();
            return Ok(sensor);
        }

        // ✅ Delete sensor
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSensor(int id)
        {
            var sensor = await _context.Sensors.FindAsync(id);
            if (sensor == null) return NotFound();

            _context.Sensors.Remove(sensor);
            await _context.SaveChangesAsync();
            return Ok("Sensor deleted");
        }
    }

    // DTO for input
    public class SensorDto
    {
        public int DeviceId { get; set; }
        public string? Type { get; set; }
        public double? Value { get; set; }
    }
}
