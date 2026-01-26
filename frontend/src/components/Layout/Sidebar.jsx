import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdPeople, MdPerson } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
  return (
    <div style={{ width: '250px', backgroundColor: 'var(--surface-color)', height: '100vh', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>Student Management</h2>
      </div>
      
      <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        <div className="sidebar-header">Main Menu</div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <li>
            <NavLink to="/dashboard" className="nav-link">
              <MdDashboard size={20} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/students" className="nav-link">
              <MdPeople size={20} /> Student List
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-header">Quick Actions</div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <li>
            <NavLink to="/students/new" className="nav-link">
              <MdPeople size={20} /> Add Student
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className="nav-link">
              <MdPerson size={20} /> My Profile
            </NavLink>
          </li>
        </ul>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={logout} className="nav-link" style={{ width: '100%', color: 'var(--danger-color)', border: 'none', background: 'none' }}>
          <FiLogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
