import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <section className="hero">
        <div className="heroLeft">
          <div className="pill">Start learning today</div>
          <h1 className="h1">
            The Best Platform <br /> Enroll in Your Special Course
          </h1>
          <p className="p">
            Build your skills with structured courses, dashboards, and a modern
            blog.
          </p>

          <div className="row">
            <Link className="btn" to="/register">
              Get Started →
            </Link>
            <Link className="btn btnGhost" to="/courses">
              Learn More
            </Link>
          </div>

          <div className="stats">
            <div className="statCard">
              <div className="statNum">120+</div>
              <div className="muted small">Courses</div>
            </div>
            <div className="statCard">
              <div className="statNum">45+</div>
              <div className="muted small">Instructors</div>
            </div>
            <div className="statCard">
              <div className="statNum">6k+</div>
              <div className="muted small">Students</div>
            </div>
          </div>
        </div>

        <div className="heroRight">
          <div className="heroCard">
            <div className="heroAvatar" />
            <div>
              <div className="title">Learn smarter</div>
              <div className="muted">Courses • Blog • Dashboard</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sectionHead">
          <div>
            <div className="kicker">Courses Details</div>
            <h2 className="h2">Explore Our Categories</h2>
            <p className="muted">Choose a category and start learning.</p>
          </div>
          <Link className="btn btnGhost" to="/courses">
            All Categories →
          </Link>
        </div>

        <div className="grid">
          {[
            "Business",
            "English",
            "Finance",
            "Content Writing",
            "Development",
            "Art & Design",
          ].map((x) => (
            <div key={x} className="card">
              <div className="iconBox" />
              <div className="title">{x}</div>
              <div className="muted small">Browse courses in {x}.</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="twoCol">
          <div className="bigIllustration" />
          <div>
            <div className="kicker">About Us</div>
            <h2 className="h2">We Offer Coaching by Skilled Advisors</h2>
            <p className="muted">
              Add real content later from the admin dashboard. This is a ready
              layout like your screenshot.
            </p>

            <div className="featureGrid">
              {[
                "Exclusive Coach",
                "Master Certified",
                "Creative Minds",
                "Video Tutorials",
              ].map((f) => (
                <div key={f} className="miniCard">
                  <div className="check" />
                  <div>
                    <div className="title">{f}</div>
                    <div className="muted small">Short description here.</div>
                  </div>
                </div>
              ))}
            </div>

            <Link className="btn" to="/register">
              Learn More →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}