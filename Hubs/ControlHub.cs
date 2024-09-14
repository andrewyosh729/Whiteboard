using Microsoft.AspNetCore.SignalR;
using Whiteboard.Model;

namespace Whiteboard.Hubs;

public class ControlHub : Hub
{
    public async Task SendMousePosition(int userId, MousePosition mousePosition)
    {
        await Clients.All.SendAsync("ReceiveMousePosition", userId, mousePosition);
    }

    public async Task SendDrawingStart(int userId)
    {
        await Clients.All.SendAsync("ReceiveDrawingStart", userId);
    }

    public async Task SendDrawingEnd(int userId)
    {
        await Clients.All.SendAsync("ReceiveDrawingEnd", userId);
    }
}