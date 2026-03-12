import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bidApi, type Bid } from '../../api/bidApi'

export default function FreelancerMyBidsPage() {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bidApi.getMyBids()
      .then(setBids)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-screen">Loading your bids...</div>

  return (
    <section>
      <h1 className="dashboard-section-title">My Bids</h1>
      
      {bids.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven&apos;t placed any bids yet.</p>
          <Link to="/freelancer/tasks" className="primary-button" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            Browse Tasks
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {bids.map((bid) => (
            <div key={bid.id} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Link to={`/freelancer/tasks/${bid.task.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ marginBottom: '0.25rem', color: 'var(--primary)' }}>{bid.task.title}</h3>
                </Link>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>${bid.amount}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Placed on {bid.createdAt ? new Date(bid.createdAt).toLocaleDateString() : 'recent'}
                  </span>
                </div>
              </div>
              <span className={`tag ${bid.status.toLowerCase()}`} style={{ 
                background: bid.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.1)' : 
                            bid.status === 'REJECTED' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                color: bid.status === 'ACCEPTED' ? '#10b981' : 
                       bid.status === 'REJECTED' ? '#f87171' : 'var(--primary)',
                border: bid.status === 'ACCEPTED' ? '1px solid rgba(16, 185, 129, 0.2)' : 
                        bid.status === 'REJECTED' ? '1px solid rgba(248, 113, 113, 0.2)' : '1px solid rgba(99, 102, 241, 0.2)'
              }}>{bid.status}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

