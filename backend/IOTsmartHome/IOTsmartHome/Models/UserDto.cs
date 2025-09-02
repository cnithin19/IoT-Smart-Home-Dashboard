using System.ComponentModel.DataAnnotations;

namespace IOTsmartHome.Models
{
    public class UserDto
    {
        [Key]
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}
