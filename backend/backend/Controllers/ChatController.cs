using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ChatController> _logger;

    public ChatController(AppDbContext context, ILogger<ChatController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private int? GetCurrentUserId()
    {
        var value = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return string.IsNullOrEmpty(value) ? null : int.Parse(value);
    }

    // ── Sessions ──────────────────────────────────────────────────────────────

    [HttpGet("sessions")]
    public async Task<ActionResult<List<ChatSessionDto>>> GetChatSessions()
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var sessions = await _context.ChatSessions
            .Where(s => s.UserId == userId.Value && s.IsActive)
            .OrderByDescending(s => s.UpdatedAt)
            .Select(s => new ChatSessionDto
            {
                Id = s.Id,
                Title = s.Title,
                Mode = s.Mode,
                Model = s.Model,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                MessageCount = s.Messages.Count
            })
            .ToListAsync();

        return Ok(sessions);
    }

    [HttpGet("sessions/{sessionId:guid}")]
    public async Task<ActionResult<ChatSessionDto>> GetChatSession(Guid sessionId)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var session = await _context.ChatSessions
            .Where(s => s.Id == sessionId && s.UserId == userId.Value && s.IsActive)
            .Select(s => new ChatSessionDto
            {
                Id = s.Id,
                Title = s.Title,
                Mode = s.Mode,
                Model = s.Model,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                MessageCount = s.Messages.Count
            })
            .FirstOrDefaultAsync();

        return session == null ? NotFound() : Ok(session);
    }

    [HttpPost("sessions")]
    public async Task<ActionResult<ChatSessionDto>> CreateSession([FromBody] CreateChatSessionDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        if (!ModelState.IsValid) return BadRequest(ModelState);

        var session = new ChatSession
        {
            Id = Guid.NewGuid(),
            UserId = userId.Value,
            Title = string.IsNullOrWhiteSpace(dto.Title) ? "New Chat" : dto.Title,
            Mode = dto.Mode,
            Model = dto.Model,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.ChatSessions.Add(session);
        await _context.SaveChangesAsync();

        return Ok(new ChatSessionDto
        {
            Id = session.Id,
            Title = session.Title,
            Mode = session.Mode,
            Model = session.Model,
            CreatedAt = session.CreatedAt,
            UpdatedAt = session.UpdatedAt,
            MessageCount = 0
        });
    }

    [HttpPut("sessions/{sessionId:guid}")]
    public async Task<IActionResult> UpdateSessionTitle(Guid sessionId, [FromBody] UpdateSessionTitleDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        if (!ModelState.IsValid) return BadRequest(ModelState);

        var session = await _context.ChatSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId.Value);

        if (session == null) return NotFound();

        session.Title = dto.Title;
        session.HasCustomName = true;
        session.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("sessions/{sessionId:guid}")]
    public async Task<IActionResult> DeleteSession(Guid sessionId)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var session = await _context.ChatSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId.Value);

        if (session == null) return NotFound();

        session.IsActive = false;
        session.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ── Messages ──────────────────────────────────────────────────────────────

    [HttpGet("sessions/{sessionId:guid}/messages")]
    public async Task<ActionResult<List<ChatMessageDto>>> GetChatMessages(Guid sessionId)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        // Ownership check
        var sessionExists = await _context.ChatSessions
            .AnyAsync(s => s.Id == sessionId && s.UserId == userId.Value);

        if (!sessionExists) return NotFound();

        var messages = await _context.ChatMessages
            .Where(m => m.ChatSessionId == sessionId)
            .OrderBy(m => m.OrderNumber)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                Role = m.Role,
                Content = m.Content,
                Timestamp = m.Timestamp,
                OrderNumber = m.OrderNumber
            })
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost("messages")]
    public async Task<ActionResult<object>> SaveMessage([FromBody] SaveMessageDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        if (!ModelState.IsValid) return BadRequest(ModelState);

        var session = await _context.ChatSessions.Include(chatSession => chatSession.Messages)
            .FirstOrDefaultAsync(s => s.Id == dto.ChatSessionId && s.UserId == userId.Value);

        if (session == null) return NotFound();

        var message = new ChatMessage
        {
            Id = Guid.NewGuid(),
            ChatSessionId = dto.ChatSessionId,
            Role = dto.Role,
            Content = dto.Content,
            Timestamp = DateTime.UtcNow,
            OrderNumber = await _context.ChatMessages
                .CountAsync(m => m.ChatSessionId == dto.ChatSessionId) + 1
        };

        _context.ChatMessages.Add(message);
        session.UpdatedAt = DateTime.UtcNow;
        if (!session.HasCustomName && message.Role == "user")
        {
            try
            {
                using var doc = JsonDocument.Parse(message.Content);
                var title = doc.RootElement.GetProperty("content").GetString();
                if (title != null)
                {
                    session.Title = title;
                    _logger.LogInformation("Updated session title for session {SessionId}", session.Id);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to deserialize message: {ex.Message}");
            }
        }

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { messageId = message.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving message for session {SessionId}", dto.ChatSessionId);
            return StatusCode(500, new { message = "An error occurred while saving the message" });
        }
    }
}
