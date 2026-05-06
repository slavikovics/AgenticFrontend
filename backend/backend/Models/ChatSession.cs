using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class ChatSession
{
    [Key]
    public Guid Id { get; set; }
 
    [Required]
    public int UserId { get; set; }
 
    [Required]
    [MaxLength(200)]
    public string Title { get; set; }
 
    [MaxLength(50)]
    public string Mode { get; set; }
 
    [MaxLength(100)]
    public string Model { get; set; }
 
    public DateTime CreatedAt { get; set; }
 
    public DateTime UpdatedAt { get; set; }
 
    public bool IsActive { get; set; } = true;
    
    public bool HasCustomName { get; set; } = false;
 
    // Navigation
    public virtual ICollection<ChatMessage> Messages { get; set; }
}