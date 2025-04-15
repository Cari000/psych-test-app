import { useEffect, useState } from "react";

export default function UserList({ refreshTrigger }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Erro ao buscar utilizadores", err));
  }, [refreshTrigger]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#fff", textAlign: "center" }}>
          Utilizadores
        </h2>

        <input
          type="text"
          placeholder="Procurar por nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "1.5rem",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />

        {/* Scrollable list container */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: "50vh",
            paddingRight: "4px", // prevent scrollbar overlap
          }}
        >
          {filteredUsers.length === 0 ? (
            <p style={{ color: "#fff" }}>Nenhum utilizador encontrado.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  style={{
                    background: "#fff",
                    borderRadius: "6px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <strong>{user.name}</strong>
                  <br />
                  <small>{user.tests.length} teste(s)</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
