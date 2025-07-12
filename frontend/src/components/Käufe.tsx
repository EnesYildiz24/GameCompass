import { Link } from "react-router-dom";

export default function Käufe() {
  return (
    <div
      style={{
        background: "#fff",
        color: "#1e1e1e",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <h2>Diese Seite ist in Bearbeitung.</h2>
      <Link
        to="/about"
        style={{
          marginTop: "2rem",
          padding: "0.7rem 1.5rem",
          background: "white",
          color: "#1e1e1e",
          border: "2px solid #1e1e1e",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "1rem",
          transition: "background 0.2s, color 0.2s"
        }}
      >
        Zurück
      </Link>
    </div>
  );
}