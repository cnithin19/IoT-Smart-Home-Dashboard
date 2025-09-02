namespace IOTsmartHome.Models
{
    public class DeviceDto
    {
        public string? Type { get; set; }
        public string? Name { get; set; }
        public string? Status { get; set; }
        public string? CustomCode { get; set; }
        public bool? HasSensor { get; set; }
        public int? UserId { get; set; }
    }
}
