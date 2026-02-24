export default function Courses() {
  return (
    <div className="container">
      <h1 className="h2">Courses</h1>
      <p className="muted">Këtu do listohen kurset nga API më vonë.</p>

      <div className="grid">
        {[1, 2, 3, 4, 5, 6].map((x) => (
          <div key={x} className="card">
            <div className="thumb" />
            <div className="title">Course #{x}</div>
            <div className="muted small">Short course description.</div>
            <button className="btn btnGhost" style={{ marginTop: 12 }}>
              View →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}