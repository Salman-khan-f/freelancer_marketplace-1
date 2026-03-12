import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChatWindow } from '../../components/chat/ChatWindow'
import { taskApi, type Task } from '../../api/taskApi'
import { bidApi } from '../../api/bidApi'

export default function FreelancerTaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [bidProposal, setBidProposal] = useState('')
  const [submittingBid, setSubmittingBid] = useState(false)
  const [bidMessage, setBidMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (taskId) {
      taskApi.getTaskById(taskId)
        .then(setTask)
        .finally(() => setLoading(false))
    }
  }, [taskId])

  const handleBidSubmit = async () => {
    if (!taskId || !bidAmount.trim() || !bidProposal.trim()) {
      setBidMessage({ type: 'error', text: 'Please fill in all fields.' })
      return
    }

    setSubmittingBid(true)
    setBidMessage(null)

    try {
      await bidApi.placeBid(taskId, {
        amount: Number(bidAmount),
        proposal: bidProposal
      })
      setBidMessage({ type: 'success', text: 'Bid placed successfully!' })
      setBidAmount('')
      setBidProposal('')
    } catch (err) {
      console.error(err)
      setBidMessage({ type: 'error', text: 'Failed to place bid. Please try again.' })
    } finally {
      setSubmittingBid(false)
    }
  }

  if (loading) return <div className="loading-screen">Loading task details...</div>
  if (!task) return <div className="glass" style={{ padding: '2rem' }}>Task not found</div>

  return (
    <section>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/freelancer/tasks" style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          &larr; Back to Browse
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
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Collaboration</h2>
              <ChatWindow taskId={task.id} />
            </div>
          )}
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Budget Range</h2>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
              ${task.budgetMin} - ${task.budgetMax}
            </div>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Place a Bid</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-field">
                <label>Proposed Amount ($)</label>
                <input 
                  type="number" 
                  placeholder="Enter amount..." 
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Proposal / Pitch</label>
                <textarea 
                  placeholder="Explain why you're the best for this task..." 
                  rows={4}
                  style={{ width: '100%', resize: 'none' }}
                  value={bidProposal}
                  onChange={(e) => setBidProposal(e.target.value)}
                />
              </div>
              {bidMessage && (
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: bidMessage.type === 'success' ? '#10b981' : '#f87171',
                  textAlign: 'center'
                }}>
                  {bidMessage.text}
                </p>
              )}
              <button 
                className="primary-button" 
                style={{ width: '100%' }}
                onClick={handleBidSubmit}
                disabled={submittingBid}
              >
                {submittingBid ? 'Submitting...' : 'Submit Bid'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

