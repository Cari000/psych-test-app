import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserList({ refreshTrigger }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiUrl}/api/users`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Tem a certeza que deseja eliminar este utilizador?")) {
      try {
        const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
          method: "DELETE",
        });
        
        if (!response.ok) throw new Error("Failed to delete user");
        
        // Remove the user from the local state to update the UI
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "1rem", color: "#fff", textAlign: "center" }}>
        Utilizadores
      </h2>

      <input
        type="text"
        placeholder="Procurar por nome"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInputStyle}
      />

      {isLoading ? (
        <p style={{ color: "#fff", textAlign: "center" }}>A carregar...</p>
      ) : error ? (
        <p style={{ color: "#ff4444", textAlign: "center" }}>{error}</p>
      ) : filteredUsers.length === 0 ? (
        <p style={{ color: "#fff", textAlign: "center" }}>
          {searchTerm ? "Nenhum utilizador encontrado" : "Nenhum utilizador registado"}
        </p>
      ) : (
        <div style={listContainerStyle}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {filteredUsers.map((user) => (
              <li key={user.id} style={userItemStyle}>
                <div style={userContentStyle}>
                  <div style={userInfoStyle}>
                    <strong style={userNameStyle}>{user.name}</strong>
                    <div style={testCountStyle}>
                      {user.tests?.length || 0} teste(s)
                    </div>
                  </div>
                  <div style={actionButtonsStyle}>
                    <Link
                      to={`/user/${user.id}`}
                      style={profileButtonStyle}
                      state={{ user }}
                    >
                      Perfil
                    </Link>
                    <Link
                      to={`/user/${user.id}/new-test`}
                      style={testButtonStyle}
                      state={{ user }}
                    >
                      Novo Teste
                    </Link>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={deleteButtonStyle}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Styles
const containerStyle = {
  width: "100%",
  maxWidth: "1000px",
  padding: "1.5rem",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  backdropFilter: "blur(8px)",
  margin: "0 auto",
};

const searchInputStyle = {
  padding: "0.75rem",
  width: "100%",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "8px",
  marginBottom: "1.5rem",
  fontSize: "1rem",
  background: "rgba(255, 255, 255, 0.8)",
};

const listContainerStyle = {
  maxHeight: "60vh",
  overflowY: "auto",
  paddingRight: "8px",
};

const userItemStyle = {
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const userContentStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
};

const userInfoStyle = {
  flex: 1,
};

const userNameStyle = {
  display: "block",
  marginBottom: "0.25rem",
  fontSize: "1.1rem",
};

const testCountStyle = {
  fontSize: "0.85rem",
  color: "#666",
};

const actionButtonsStyle = {
  display: "flex",
  gap: "0.5rem",
};

const profileButtonStyle = {
  padding: "0.5rem 1rem",
  background: "#2196F3",
  color: "white",
  borderRadius: "4px",
  textDecoration: "none",
  fontSize: "0.9rem",
};

const testButtonStyle = {
  padding: "0.5rem 1rem",
  background: "#4CAF50",
  color: "white",
  borderRadius: "4px",
  textDecoration: "none",
  fontSize: "0.9rem",
};

const deleteButtonStyle = {
  padding: "0.5rem 1rem",
  background: "#f44336",
  color: "white",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  fontSize: "0.9rem",
};