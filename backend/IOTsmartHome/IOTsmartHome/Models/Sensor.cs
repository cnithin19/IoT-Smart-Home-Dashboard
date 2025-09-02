using System;

namespace IOTsmartHome.Models
{
    public class Sensor
    {
        public int Id { get; set; }
        public int DeviceId { get; set; }
        public string? Type { get; set; }
        public double? Value { get; set; }
        public DateTime? Timestamp { get; set; }


        public Device? Device { get; set; }
     //   public int UserId { get; set; }
    }
}
