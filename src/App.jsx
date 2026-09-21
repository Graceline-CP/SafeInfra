import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Upload from "./components/Upload";
import AIAnalysisResults from "./components/AIAnalysisResults";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Layout from "./components/Layout";
import MyUploads from "./components/MyUploads";
import ProtectedRoute from "./components/ProtectedRoute";

const Private = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login - no sidebar, not protected */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/upload" element={<Private><Upload /></Private>} />
        <Route path="/analysis" element={<Private><AIAnalysisResults /></Private>} />
        <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="/reports" element={<Private><Reports /></Private>} />
        <Route path="/my-uploads" element={<Private><MyUploads /></Private>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;