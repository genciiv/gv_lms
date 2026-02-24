import { useEffect, useState } from "react";
import { api } from "./api";

export default function App() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    api.get("/api/health")
      .then((res) => setMsg(res.data.message))
      .catch(() => setMsg("API not connected ❌"));
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Educax LMS</h1>
      <p>{msg}</p>
    </div>
  );
}