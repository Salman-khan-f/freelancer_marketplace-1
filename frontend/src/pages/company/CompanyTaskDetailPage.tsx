import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChatWindow } from '../../components/chat/ChatWindow'
import { taskApi, type Task } from '../../api/taskApi'
import { bidApi, type Bid } from '../../api/bidApi'

export default function CompanyTaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const [task, setTask] = useState<Task | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (taskId) {
      Promise.all([
        taskApi.getTaskById(taskId),
        bidApi.getBidsForTask(taskId).catch(() => [] as Bid[])
      ]).then(([taskData, bidsData]) => {
        setTask(taskData)
        setBids(bidsData)
      }).finally(() => setLoading(false))
    }
  }, [taskId])

  const handleAcceptBid = async (bidId: string) => {
    if (!window.confirm('Are you sure you want to accept this bid? This will assign the freelancer and close bidding.')) return

    try {
      await bidApi.acceptBid(bidId)
      // Refresh task and bids
      const [taskData, bidsData] = await Promise.all([
        taskApi.getTaskById(taskId!),
        bidApi.getBidsForTask(taskId!)
      ])
      setTask(taskData)
      setBids(bidsData)
    } catch (err) {
      alert('Failed to accept bid.')
      console.error(err)
    }
  }

  const handleRejectBid = async (bidId: string) => {
    try {
      await bidApi.rejectBid(bidId)
      const bidsData = await bidApi.getBidsForTask(taskId!)
      setBids(bidsData)
    } catch (err) {
      alert('Failed to reject bid.')
      console.error(err)
    }
  }

  if (loading) return <div className="loading-screen">Loading task details...</div>
  if (!task) return <div className="glass" style={{ padding: '2rem' }}>Task not found</div>

  return (
    <section>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/company/tasks" style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          &larr; Back to My Tasks
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 className="dashboard-section-title" style={{ marginBottom: '0.5rem' }}>{task.title}</h1>
          <span className="tag">{task.status}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Description</h2>
            <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{task.description}</p>
          </div>

          {task.freelancer && (
            <div className="glass" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Project Communication</h2>
              <ChatWindow taskId={task.id} />
            </div>
          )}

          {!task.freelancer && (
            <div className="glass" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Bids</h2>
              {bids.filter(b => b.status === 'PENDING').length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No active bids for this task.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {bids.filter(b => b.status === 'PENDING').map(bid => (
                    <div key={bid.id} className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>${bid.amount}</p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>By Freelancer ID: {bid.freelancer.id}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="primary-button" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => handleAcceptBid(bid.id)}
                          >
                            Accept
                          </button>
                          <button 
                            style={{ 
                              padding: '0.4rem 0.8rem', 
                              fontSize: '0.8rem',
                              background: 'rgba(248, 113, 113, 0.1)',
                              color: '#f87171',
                              border: '1px solid rgba(248, 113, 113, 0.2)',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleRejectBid(bid.id)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>&quot;{bid.proposal}&quot;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Budget Allocated</h2>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
              ${task.budgetMin} - ${task.budgetMax}
            </div>
          </div>
          
          {task.freelancer && (
            <div className="glass" style={{ padding: '2rem', border: '1px solid var(--primary)' }}>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', color: 'var(--primary)' }}>Assigned Freelancer</h2>
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>ID: {task.freelancer.id}</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

