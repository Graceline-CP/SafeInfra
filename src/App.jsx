import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Upload from "./components/Upload";
import AIAnalysisResults from "./components/AIAnalysisResults";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Layout from "./components/Layout";
import MyUploads from "./components/MyUploads";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login - NO SIDEBAR */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Upload */}
        <Route
          path="/upload"
          element={
            <Layout>
              <Upload />
            </Layout>
          }
        />

        {/* Analysis */}
        <Route
          path="/analysis"
          element={
            <Layout>
              <AIAnalysisResults />
            </Layout>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <Layout>
              <Reports />
            </Layout>
          }
        />
        <Route
          path="/my-uploads"
          element={
            <Layout>
              <MyUploads />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;