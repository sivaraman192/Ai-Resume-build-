import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ResumeProvider } from './context/ResumeContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Builder from './pages/Builder.jsx';
import Preview from './pages/Preview.jsx';
import Templates from './pages/Templates.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ResumeProvider>
          <div className="flex flex-col min-h-screen bg-lightBg dark:bg-darkBg text-slate-800 dark:text-slate-200 transition-colors duration-200">
            {/* Nav Header (hidden during print) */}
            <div className="no-print">
              <Navbar />
            </div>

            {/* Main Application Body */}
            <main className="flex-1 flex flex-col">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/templates"
                  element={
                    <ProtectedRoute>
                      <Templates />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/builder"
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <Builder />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/builder/:id"
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <Builder />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/preview/:id"
                  element={
                    <ProtectedRoute>
                      <Preview />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Footer (hidden during print and on builder views) */}
            <Routes>
              <Route
                path="/builder"
                element={null}
              />
              <Route
                path="/builder/:id"
                element={null}
              />
              <Route
                path="*"
                element={
                  <div className="no-print">
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </div>
        </ResumeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
