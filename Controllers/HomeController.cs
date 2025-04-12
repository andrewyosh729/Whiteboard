using Microsoft.AspNetCore.Mvc;
using Whiteboard.Services;

namespace Whiteboard.Controllers;

public readonly struct UserInitializationData
{
    public UserInitializationData(long userId, IReadOnlyList<Drawing> existingDrawings)
    {
        UserId = userId;
        ExistingDrawings = existingDrawings;
    }

    public long UserId { get; }
    public IReadOnlyList<Drawing> ExistingDrawings { get; }
}
public class HomeController : Microsoft.AspNetCore.Mvc.Controller
{
    private IIdService IdService { get; }

    private IDrawingCacheService DrawingCacheService { get; }
    public HomeController(IIdService idService, IDrawingCacheService drawingCacheService)
    {
        IdService = idService;
        DrawingCacheService = drawingCacheService;
    }
    // GET
    public IActionResult Index()
    {
        
        return View(new UserInitializationData(IdService.GetNextId(), DrawingCacheService.GetCachedDrawings()));
    }
}