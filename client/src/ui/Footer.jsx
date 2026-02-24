export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footerInner">
        <div>
          <div className="footerTitle">Educax LMS</div>
          <div className="muted">
            LMS + Blog platform built with MERN.
          </div>
        </div>

        <div className="muted small">© {new Date().getFullYear()} Educax</div>
      </div>
    </footer>
  );
}