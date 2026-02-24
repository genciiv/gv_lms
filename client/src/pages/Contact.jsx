export default function Contact() {
  return (
    <div className="container">
      <h1 className="h2">Contact</h1>
      <div className="card" style={{ maxWidth: 560 }}>
        <div className="title">Send a message</div>
        <p className="muted small">Form placeholder.</p>
        <div className="form">
          <input className="input" placeholder="Your name" />
          <input className="input" placeholder="Your email" />
          <textarea className="input" rows="5" placeholder="Message" />
          <button className="btn">Send</button>
        </div>
      </div>
    </div>
  );
}