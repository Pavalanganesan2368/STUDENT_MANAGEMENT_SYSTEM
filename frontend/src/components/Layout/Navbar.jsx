import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MdNotifications, MdSettings, MdMenu, MdDarkMode, MdLightMode } from 'react-icons/md';

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
  return (
    <div style={{ height: '64px', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
      <div className="flex items-center gap-2">
        <button 
            className="show-mobile btn btn-outline" 
            style={{ border: 'none', padding: '0.5rem' }}
            onClick={onMenuClick}
        >
            <MdMenu size={24} />
        </button>
        <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--primary-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>SMS</h2>
      </div>
      
      <div className="flex items-center gap-2">
        <div style={{ position: 'relative' }} className="hide-mobile">
          <input 
            type="text" 
            placeholder="Search..." 
            className="input" 
            style={{ width: '200px', backgroundColor: 'var(--background-color)' }}
          />
        </div>
        
        <button className="btn btn-outline" style={{ border: 'none', padding: '0.4rem' }}><MdNotifications size={20} /></button>
        <button className="btn btn-outline hide-mobile" style={{ border: 'none', padding: '0.4rem' }}><MdSettings size={20} /></button>
        
        <button 
            className="btn btn-outline" 
            style={{ border: 'none', padding: '0.4rem' }}
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
        </button>
        
        <div className="flex items-center">
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>
                {user?.email?.charAt(0).toUpperCase()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
