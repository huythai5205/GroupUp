using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(
            UserManager<AppUser> userManager,
            DataContext context,
            RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var usersData = await System.IO.File.ReadAllTextAsync("Data/SeedData/UsersSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(usersData);
            if (users == null) return;

            var roles = new List<AppRole>{
                new AppRole{
                    Id = Guid.NewGuid().ToString(),
                    Name = "Member"
                    },
                new AppRole{
                    Id = Guid.NewGuid().ToString(),
                    Name = "Admin"
                    }
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.Email = user.Email.ToLower();
                await userManager.CreateAsync(user, "Password1!");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                Email = "admin@admin.com",
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRoleAsync(admin, "Admin");

            var eventsData = await System.IO.File.ReadAllTextAsync("Data/SeedData/EventsSeedData.json");
            var events = JsonSerializer.Deserialize<List<Event>>(eventsData);

            foreach (var @event in events)
            {
                await context.Events.AddAsync(@event);
                await context.SaveChangesAsync();
            }
        }
    }
}