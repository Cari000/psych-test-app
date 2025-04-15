import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import scl90Questions from "../assets/scl90-questions-pt.json";

export default function SCL90Test() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initialAnswers = {};
    scl90Questions.perguntas.forEach((question) => {
      initialAnswers[question.id] = 0;
    });
    setAnswers(initialAnswers);
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: parseInt(value),
    }));
  };

  const calculateScores = () => {
    const dimensions = {};
    for (const [dimension, questions] of Object.entries(scl90Questions.dimensoes)) {
      const score = questions.reduce((sum, qId) => sum + (answers[qId] || 0), 0);
      dimensions[dimension] = score;
    }
    return dimensions;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const scores = calculateScores();
    const createdAt = new Date().toISOString(); 
    try {
      const response = await fetch(`http://localhost:4000/api/users/${id}/tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "SCL-90",
          date: createdAt, 
          answers,
          scores,
          createdAt,  
          completedAt: createdAt, 
        }),
      });

      if (response.ok) {
        navigate("/"); 
      } else {
        console.error("Server error:", await response.text());
      }
    } catch (error) {
      console.error("Error saving test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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

          h2 {
            text-align: center;
            margin-bottom: 1rem;
            font-size: 1.8rem;
            color: #fff;
          }

          .question-box {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .question-options {
            display: flex;
            gap: 1rem;
            margin-top: 0.5rem;
          }

          .submit-button {
            padding: 1rem 2rem;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            display: block;
            margin: 2rem auto;
            opacity: 1;
            transition: opacity 0.3s;
          }

          .submit-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          minHeight: "100vh",
          minWidth: "100vw",
          padding: "0",
          fontFamily: "sans-serif",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <div className="aurora-background" />
        <div className="content-wrapper">
          <h2>Teste SCL-90</h2>

          {scl90Questions.perguntas.map((question) => (
            <div key={question.id} className="question-box">
              <p>
                {question.id}. {question.texto}
              </p>
              <div className="question-options">
                {[0, 1, 2, 3, 4].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={value}
                      checked={answers[question.id] === value}
                      onChange={() => handleAnswerChange(question.id, value)}
                    />
                    {scl90Questions.escala[value]}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "A guardar..." : "Concluir Teste"}
          </button>
        </div>
      </div>
    </>
  );
}
