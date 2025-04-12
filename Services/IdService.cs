using System.Numerics;

namespace Whiteboard.Services;

public class DrawingCacheService : IDrawingCacheService
{
    private List<Drawing> Drawings { get; } = new List<Drawing>();

    public void CacheDrawing(Drawing drawing)
    {
        Drawings.Add(drawing);
    }

    public IReadOnlyList<Drawing> GetCachedDrawings() => Drawings;
}

public interface IDrawingCacheService
{
    public void CacheDrawing(Drawing drawing);
    IReadOnlyList<Drawing> GetCachedDrawings();
}

public readonly struct Drawing
{
    public Drawing(int userId, List<Vector3> drawingPoints)
    {
        UserId = userId;
        DrawingPoints = drawingPoints;
    }

    public int UserId { get; }
    public List<Vector3> DrawingPoints { get; }
}

public class IdService : IIdService
{
    private long m_currentId;

    public long GetNextId()
    {
        return Interlocked.Increment(ref m_currentId);
    }
}