using System;
using System.Collections.Generic;

namespace ToDoAPI.Models;

public partial class Activity
{
    public uint Id { get; set; }

    public string UserId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public DateTime When { get; set; }
}
