export default function Blog() {
  return (
    <div className="container">
      <h1 className="h2">Blog</h1>
      <p className="muted">Këtu do dalin postimet nga API më vonë.</p>

      <div className="grid">
        {[1, 2, 3].map((x) => (
          <div key={x} className="card">
            <div className="thumb" />
            <div className="title">Post #{x}</div>
            <div className="muted small">
              Short excerpt of the blog post.
            </div>
            <button className="btn btnGhost" style={{ marginTop: 12 }}>
              Read →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}