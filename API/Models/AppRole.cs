using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class AppRole : IdentityRole<string>
    {
        public List<AppUserRole> UserRoles { get; set; }
    }
}