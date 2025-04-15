import { useState } from "react";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

export default function Home() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleUserCreated = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <>
      {/* Inline keyframes */}
      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Aurora background animation */
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

          /* Main content wrapper */
          .content-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            height: 100vh; /* Full viewport height */
            width: 100%; /* Full viewport width */
            padding: 1rem;
            box-sizing: border-box;
            z-index: 1;
            position: relative;
            overflow: hidden; /* Prevent vertical scrollbar from showing on the page */
          }

          h1 {
            text-align: center;
            margin-bottom: 0.5rem;
            font-size: 2rem;
            color: #fff;
          }

          hr {
            margin: 0.5rem auto;
            border: none;
            border-top: 1px solid #ccc;
            width: 80%;
          }

          /* Wrapper for form and user list */
          .user-form-list-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%; /* Ensure it takes full width */
            flex-grow: 1;
            justify-content: flex-start;
            overflow-y: auto; /* Allow vertical scroll for the content */
          }

          /* Form & user list elements take up the maximum width of the parent container */
          .user-form-list-wrapper input,
          .user-form-list-wrapper ul {
            width: 100%;
            box-sizing: border-box;
            max-width: 100%; /* Ensure max-width is inherited */
          }

          .user-form-list-wrapper li {
            width: 100%;
            box-sizing: border-box;
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
        {}
        <div className="aurora-background" />

        {}
        <div className="content-wrapper">
          <h1>Sistema de Avaliação Psicológica</h1>

          <div className="user-form-list-wrapper">
            <UserForm onUserCreated={handleUserCreated} />

            <hr />

            <UserList refreshTrigger={refreshCount} />
          </div>
        </div>
      </div>
    </>
  );
}
