import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Upload from "./components/Upload";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Upload */}
        <Route path="/upload" element={<Upload />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Reports */}
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;