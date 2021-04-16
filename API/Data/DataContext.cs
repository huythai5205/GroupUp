using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, string,
        IdentityUserClaim<string>, AppUserRole, IdentityUserLogin<string>,
        IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public DataContext(DbContextOptions options) : base(options)
        { }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<UserEvent> UserEvents { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<MemberMessage> MemberMessages { get; set; }
        public DbSet<EventMessage> EventMessages { get; set; }
        public DbSet<Connection> Connections { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserEvent>()
                .HasKey(ue => new { ue.UserId, ue.EventId });

            builder.Entity<UserEvent>()
              .HasOne(ue => ue.User)
              .WithMany(au => au.EventsParticipating)
              .HasForeignKey(ue => ue.UserId)
              .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserEvent>()
                .HasOne(ue => ue.Event)
                .WithMany(e => e.UsersParticipating)
                .HasForeignKey(ue => ue.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Group>()
               .HasMany(g => g.Connections)
               .WithOne()
               .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<AppUser>()
                .HasMany(au => au.UserRoles)
                .WithOne(ur => ur.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<AppRole>()
                .HasMany(au => au.UserRoles)
                .WithOne(ur => ur.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            builder.Entity<Event>()
                .Property(e => e.Id)
                .ValueGeneratedOnAdd();

            builder.Entity<Event>()
                .HasMany(e => e.Photos)
                .WithOne(p => p.Event);

            builder.Entity<Event>()
                .HasOne(e => e.Creator)
                .WithMany(au => au.EventsCreated);

            builder.Entity<MemberMessage>()
                .HasOne(m => m.Recipient)
                .WithMany(au => au.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<MemberMessage>()
               .HasOne(m => m.Sender)
               .WithMany(au => au.MessagesSent)
               .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<EventMessage>()
                .HasOne(em => em.Event)
                .WithMany(e => e.Messages)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}