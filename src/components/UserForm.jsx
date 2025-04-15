import { useState } from "react";

export default function UserForm({ onUserCreated }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

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
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", textAlign: "center" }}>
        Criar novo utilizador
      </h2>

      {/* Input and Button Inline */}
      <div style={rowStyle}>
        <input
          type="text"
          placeholder="Nome do utilizador"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Criar
        </button>
      </div>

      {message && <p style={{ marginTop: "1rem", textAlign: "center" }}>{message}</p>}
    </form>
  );
}

// Form wrapper
const formStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem",
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
  boxSizing: "border-box",
};

// Row for input + button
const rowStyle = {
  display: "flex",
  width: "100%",
  gap: "0.5rem", // spacing between input and button
};

// Input field
const inputStyle = {
  flexGrow: 1,
  padding: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "1rem",
  boxSizing: "border-box",
};

// Button
const buttonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "1rem",
  whiteSpace: "nowrap",
};
