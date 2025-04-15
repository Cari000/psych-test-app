import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PatientProfile from "./pages/PatientProfile";
import TestEditor from "./pages/TestEditor";
import TestRunner from "./pages/TestRunner";
import TestResults from "./pages/TestResults";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient/:id" element={<PatientProfile />} />
        <Route path="/test-editor" element={<TestEditor />} />
        <Route path="/test/:testId/run" element={<TestRunner />} />
        <Route path="/test/:testId/results" element={<TestResults />} />
      </Routes>
    </Router>
  );
  
}
