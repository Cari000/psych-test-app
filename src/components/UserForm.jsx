import { useState } from "react";

export default function UserForm({ onUserCreated }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setMessage("Utilizador criado com sucesso!");
        setName("");
        onUserCreated();
      } else {
        setMessage("Erro ao criar utilizador.");
      }
    } catch (error) {
      setMessage("Falha na conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", textAlign: "center", color: "#fff" }}>
        Criar novo utilizador
      </h2>

      <div style={rowStyle}>
        <input
          type="text"
          placeholder="Nome do utilizador"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          style={{ ...buttonStyle, opacity: isLoading ? 0.7 : 1 }}
          disabled={isLoading}
        >
          {isLoading ? "A processar..." : "Criar"}
        </button>
      </div>

      {message && (
        <p style={{ marginTop: "1rem", textAlign: "center", color: message.includes("sucesso") ? "#4CAF50" : "#ff4444" }}>
          {message}
        </p>
      )}
    </form>
  );
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  width: "90%",
  padding: "1.5rem",
  background: "rgba(255,255,255,0.1)",
  borderRadius: "12px",
  backdropFilter: "blur(8px)",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

const rowStyle = {
  display: "flex",
  gap: "0.5rem",
  width: "100%",
};

const inputStyle = {
  flexGrow: 1,
  padding: "0.75rem",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "8px",
  fontSize: "1rem",
  background: "rgba(255,255,255,0.8)",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};