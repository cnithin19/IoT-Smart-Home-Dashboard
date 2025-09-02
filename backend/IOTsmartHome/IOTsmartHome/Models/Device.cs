namespace IOTsmartHome.Models
{
    public class Device
    {
        public int Id { get; set; }
        public int UserId { get; set; }  // Links to the user who owns it
        public string? Type { get; set; }  // Like 'light', 'thermostat', 'door'
        public string? Name { get; set; }  // Like 'Living Room Light'
        public string? Status { get; set; }  // Like 'on', 'off', 'locked'
        public string? CustomCode { get; set; }
        public bool? HasSensor { get; set; }
    }
}
