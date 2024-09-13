using Microsoft.AspNetCore.SignalR;
using Whiteboard.Model;

namespace Whiteboard.Hubs;

public class ControlHub : Hub
{
    
    public async Task SendData(int userId, MousePosition mousePosition)
    {
        await Clients.All.SendAsync("ReceiveData", userId, mousePosition);
    }
}