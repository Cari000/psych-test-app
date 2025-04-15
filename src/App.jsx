// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";  // Renamed from PatientProfile for consistency
import TestSelection from "./pages/TestSelection";
import SCL90Test from "./pages/SCL90Test";  // You'll need to create this

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/user/:id/new-test" element={<TestSelection />} />
        <Route path="/user/:id/test/scl-90" element={<SCL90Test />} />
        
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}