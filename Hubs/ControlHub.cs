using System.Collections.Concurrent;
using System.Numerics;
using Microsoft.AspNetCore.SignalR;
using Whiteboard.Model;
using Whiteboard.Services;

namespace Whiteboard.Hubs;

public class ControlHub : Hub
{
    private IDrawingCacheService DrawingCacheService { get; }
    private static ConcurrentDictionary<int, List<Vector3>> CurrentDrawings { get; } = new();

    public ControlHub(IDrawingCacheService drawingCacheService)
    {
        DrawingCacheService = drawingCacheService;
    }

    public async Task SendMousePosition(int userId, MousePosition mousePosition)
    {
        if (CurrentDrawings.TryGetValue(userId, out List<Vector3> drawingPoints))
        {
            drawingPoints.Add(new Vector3(mousePosition.X, mousePosition.Y, 0));
        }

        await Clients.All.SendAsync("ReceiveMousePosition", userId, mousePosition);
    }

    public async Task SendDrawingStart(int userId)
    {
        CurrentDrawings[userId] = new List<Vector3>();
        await Clients.All.SendAsync("ReceiveDrawingStart", userId);
    }

    public async Task SendDrawingEnd(int userId)
    {
        if (CurrentDrawings.TryRemove(userId, out List<Vector3> drawingPoints))
        {
            DrawingCacheService.CacheDrawing(new Drawing(userId, drawingPoints));
        }


        await Clients.All.SendAsync("ReceiveDrawingEnd", userId);
    }
}