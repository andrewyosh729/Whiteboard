namespace Whiteboard;

public class IdService : IIdService
{
    private long m_currentId;

    public long GetNextId()
    {
        return Interlocked.Increment(ref m_currentId);
    }
}