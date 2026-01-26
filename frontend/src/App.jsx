import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import StudentProfile from './pages/StudentProfile';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';

import { useState } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 40,
                        display: 'flex'
                    }}
                    className="show-mobile"
                />
            )}

            <div style={{ 
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 50,
                transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out',
                width: '250px',
                backgroundColor: 'white'
            }} className="show-mobile">
                <Sidebar />
            </div>

            <div className="hide-mobile" style={{ width: '250px' }}>
                <Sidebar />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
                <div style={{ flex: 1, backgroundColor: 'var(--background-color)', overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

import Register from './pages/Register';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
             <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/students" element={<StudentList />} />
                <Route path="/students/new" element={<StudentForm />} />
                <Route path="/students/edit/:id" element={<StudentForm />} />
                <Route path="/students/:id" element={<StudentProfile />} />
                <Route path="/profile" element={<StudentProfile />} />
             </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  </Router>
  );
}

export default App;
