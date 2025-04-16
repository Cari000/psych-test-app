import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { id } = useParams();
  const { state } = useLocation();
  const [user, setUser] = useState(state?.user || null);
  const [testsByType, setTestsByType] = useState({});
  const [expandedTypes, setExpandedTypes] = useState({});
  const [isLoading, setIsLoading] = useState(!state?.user);
  const [isFetchingScores, setIsFetchingScores] = useState(false);

  // Sample fake tests to display alongside real ones
  const sampleTests = [
    {
      type: "PHQ-9",
      createdAt: "2023-05-15T10:30:00Z",
      scores: {
        Depression: 12,
        Anxiety: 8,
        "Sleep Quality": 5
      },
      isSample: true
    },
    {
      type: "GAD-7",
      createdAt: "2023-05-18T09:15:00Z",
      scores: {
        Anxiety: 14,
        "Stress Level": 9
      },
      isSample: true
    }
  ];

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

        const apiUrl = import.meta.env.VITE_API_URL || "";

        try {
          // Fetch real tests from API
          const response = await fetch(`${apiUrl}/api/users/${id}/tests`);
          const realTests = await response.json();
          
          // Combine real tests with sample tests
          const allTests = [...realTests, ...sampleTests];
          
          // Group tests by type
          const grouped = allTests.reduce((acc, test) => {
            if (!acc[test.type]) {
              acc[test.type] = [];
            }
            acc[test.type].push(test);
            return acc;
          }, {});
          
          setTestsByType(grouped);
          
          // Initialize expanded state for each test type
          const initialExpanded = Object.keys(grouped).reduce((acc, type) => {
            acc[type] = false;
            return acc;
          }, {});
          setExpandedTypes(initialExpanded);
          
        } catch (error) {
          console.error("Erro ao buscar resultados dos testes:", error);
        } finally {
          setIsFetchingScores(false);
        }
      };
      fetchTestScores();
    }
  }, [user, id]);

  const toggleTestType = (type) => {
    setExpandedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

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

          .test-types {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
          }

          .test-type {
            margin-bottom: 1rem;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            overflow: hidden;
          }

          .test-type-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 1rem;
            background-color: #f5f5f5;
            cursor: pointer;
            font-weight: bold;
          }

          .test-type-header:hover {
            background-color: #ebebeb;
          }

          .test-type-count {
            background-color: #4a90e2;
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
          }

          .test-type-content {
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
          }

          .test-type-content.expanded {
            padding: 1rem;
            max-height: 1000px;
          }

          .test-scores-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.5rem;
          }

          .test-scores-table th,
          .test-scores-table td {
            padding: 0.8rem;
            border: 1px solid #ddd;
            text-align: left;
          }

          .test-scores-table th {
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

          .no-tests {
            text-align: center;
            padding: 1rem;
            color: #666;
          }

          .sample-test {
            background-color: #fffde7;
          }
        `}
      </style>

      <div className="aurora-background" />
      <div className="content-wrapper">
        <h1 className="profile-header">{user.name}</h1>

        {isFetchingScores ? (
          <div className="loading">A buscar resultados dos testes...</div>
        ) : (
          <div className="test-types">
            <h2>Resultados dos Testes</h2>
            {Object.keys(testsByType).length > 0 ? (
              Object.entries(testsByType).map(([type, tests]) => (
                <div key={type} className="test-type">
                  <div 
                    className="test-type-header" 
                    onClick={() => toggleTestType(type)}
                  >
                    <span>{type}</span>
                    <span className="test-type-count">
                      {tests.length} {tests.length === 1 ? "teste" : "testes"}
                    </span>
                  </div>
                  <div className={`test-type-content ${expandedTypes[type] ? 'expanded' : ''}`}>
                    <table className="test-scores-table">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Resultados</th>
                          <th>Tipo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tests.map((test, index) => (
                          <tr key={index} className={test.isSample ? "sample-test" : ""}>
                            <td>{new Date(test.createdAt).toLocaleDateString()}</td>
                            <td>
                              <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                                {Object.entries(test.scores).map(([dimension, score], idx) => (
                                  <li key={idx}>
                                    <strong>{dimension}:</strong> <span className="score-value">{score}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>{test.isSample ? "Exemplo" : "Real"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-tests">Não há resultados de testes disponíveis.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}