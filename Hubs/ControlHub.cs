using Microsoft.AspNetCore.SignalR;
using Whiteboard.Model;

namespace Whiteboard.Hubs;

public class ControlHub : Hub
{
    
    public async Task SendData(MousePosition mousePosition)
    {
        await Clients.All.SendAsync("ReceiveData", mousePosition);
    }
}