using Microsoft.AspNetCore.Mvc;

namespace Whiteboard.Controller;

public class HomeController : Microsoft.AspNetCore.Mvc.Controller
{
    private IIdService IdService { get; }

    public HomeController(IIdService idService)
    {
        IdService = idService;
    }
    // GET
    public IActionResult Index()
    {
        return View(IdService.GetNextId());
    }
}