using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ToDoAPI.Models;

public partial class ToDoDbContext : DbContext
{
    public ToDoDbContext()
    {
    }

    public ToDoDbContext(DbContextOptions<ToDoDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Activity> Activities { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;user=root;password=;database=ToDo", Microsoft.EntityFrameworkCore.ServerVersion.Parse("11.1.2-mariadb"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb3_thai_520_w2")
            .HasCharSet("utf8mb3");

        modelBuilder.Entity<Activity>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Activity");

            entity.Property(e => e.Id).HasColumnType("int(10) unsigned");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .UseCollation("utf8mb4_thai_520_w2")
                .HasCharSet("utf8mb4");
            entity.Property(e => e.UserId)
                .HasMaxLength(13)
                .HasColumnName("UserID");
            entity.Property(e => e.When).HasColumnType("datetime");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("User");

            entity.Property(e => e.Id).HasMaxLength(13);
            entity.Property(e => e.Password).HasMaxLength(44);
            entity.Property(e => e.Salt).HasMaxLength(24);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
