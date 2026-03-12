export default function FreelancerMyWorkPage() {
  return (
    <section>
      <h1 className="dashboard-section-title">My Work</h1>
      
      <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>No active contracts found.</p>
        <button className="primary-button">Browse Available Tasks</button>
      </div>
    </section>
  )
}

