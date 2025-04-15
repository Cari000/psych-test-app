import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { id } = useParams();
  const { state } = useLocation();
  const [user, setUser] = useState(state?.user || null);
  const [testScores, setTestScores] = useState([]);
  const [isLoading, setIsLoading] = useState(!state?.user);
  const [isFetchingScores, setIsFetchingScores] = useState(false);

  useEffect(() => {
    if (!state?.user) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/users/${id}`);
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Erro ao buscar utilizador:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [id, state?.user]);

  useEffect(() => {

    if (user) {
      const fetchTestScores = async () => {
        setIsFetchingScores(true);
        try {
          const response = await fetch(`http://localhost:4000/api/users/${id}/tests`);
          const data = await response.json();
          setTestScores(data);
        } catch (error) {
          console.error("Erro ao buscar resultados dos testes:", error);
        } finally {
          setIsFetchingScores(false);
        }
      };
      fetchTestScores();
    }
  }, [user, id]);

  if (isLoading) return <div>A carregar...</div>;
  if (!user) return <div>Utilizador não encontrado</div>;

  return (
    <div className="profile-wrapper">
      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .aurora-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(-45deg, #a0f8d0, #b2f7ef, #b2e0f7, #a0d2f8);
            background-size: 400% 400%;
            animation: gradientAnimation 50s linear infinite;
            z-index: 0;
          }

          .content-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            height: 100vh;
            width: 100%;
            padding: 1rem;
            box-sizing: border-box;
            z-index: 1;
            position: relative;
            overflow-y: auto;
          }

          .profile-header {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: white;
          }

          .test-scores {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
            overflow-x: auto;
          }

          .test-scores table {
            width: 100%;
            border-collapse: collapse;
          }

          .test-scores th,
          .test-scores td {
            padding: 0.8rem;
            border: 1px solid #ddd;
            text-align: left;
          }

          .test-scores th {
            background-color: #f4f4f4;
            font-weight: bold;
          }

          .score-value {
            font-weight: bold;
          }

          .loading {
            text-align: center;
            font-size: 1.2rem;
            color: white;
          }
        `}
      </style>

      <div className="aurora-background" />
      <div className="content-wrapper">
        <h1 className="profile-header">{user.name}</h1>

        {isFetchingScores ? (
          <div className="loading">A buscar resultados dos testes...</div>
        ) : (
          <div className="test-scores">
            <h2>Resultados dos Testes</h2>
            {testScores.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Tipo de Teste</th>
                    <th>Data</th>
                    <th>Resultados</th>
                  </tr>
                </thead>
                <tbody>
                  {testScores.map((test, index) => (
                    <tr key={index}>
                      <td>{test.type}</td>
                      <td>{new Date(test.createdAt).toLocaleDateString()}</td>
                      <td>
                        <ul>
                          {Object.entries(test.scores).map(([dimension, score], idx) => (
                            <li key={idx}>
                              <strong>{dimension}:</strong> <span className="score-value">{score}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Não há resultados de testes disponíveis.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
