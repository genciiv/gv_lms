import { useAuth } from "../../auth/AuthContext";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="stack">
      <div className="card">
        <div className="title">Overview</div>
        <div className="muted">
          Welcome <b>{user?.name}</b>. This dashboard will show your courses and progress.
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="title">My Courses</div>
          <div className="muted small">0 enrolled (placeholder)</div>
        </div>
        <div className="card">
          <div className="title">Progress</div>
          <div className="muted small">0% (placeholder)</div>
        </div>
        <div className="card">
          <div className="title">Certificates</div>
          <div className="muted small">Coming soon</div>
        </div>
      </div>
    </div>
  );
}