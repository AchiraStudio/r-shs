import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "5rem" }}>
      <h1 style={{ fontSize: "4rem", color: "#ff6b6b" }}>404</h1>
      <p style={{ fontSize: "1.2rem" }}>Page not found</p>
      <Link to="/" style={{ textDecoration: "none", color: "#0077cc" }}>
        ← Go back to homepage
      </Link>
    </div>
  );
}

export default NotFound;