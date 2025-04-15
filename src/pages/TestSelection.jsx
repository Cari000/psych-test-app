import { Link, useParams } from "react-router-dom";

export default function TestSelection() {
  const { id } = useParams();

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem",
      background: "rgba(126, 32, 32, 0.1)",
      borderRadius: "12px",
      backdropFilter: "blur(8px)"
    }}>
      <h2 style={{ color: "#fff", textAlign: "center" }}>Selecionar Teste</h2>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1rem",
        marginTop: "2rem"
      }}>
        <Link 
          to={`/user/${id}/test/scl-90`}
          style={{
            padding: "2rem",
            background: "rgba(255,255,255,0.9)",
            borderRadius: "8px",
            textAlign: "center",
            textDecoration: "none",
            color: "#333",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          SCL-90
        </Link>
        
        {}
      </div>
    </div>
  );
}