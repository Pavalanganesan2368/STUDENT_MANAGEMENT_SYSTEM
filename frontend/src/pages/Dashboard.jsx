import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const CircleGauge = ({ value, label, color }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx="50" cy="50" r={radius}
                        stroke="var(--border-color)" strokeWidth="8" fill="transparent"
                    />
                    <motion.circle
                        cx="50" cy="50" r={radius}
                        stroke={color} strokeWidth="8" fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                }}>
                    {value}%
                </div>
            </div>
            <p className="text-sm text-secondary" style={{ marginTop: '0.5rem' }}>{label}</p>
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeCourses: 0,
        recentEnrollments: 0,
        capacityPercentage: 0
    });
    const [loading, setLoading] = useState(true);
    const [newsIndex, setNewsIndex] = useState(0);
    const newsArticles = [
        { id: 1, title: "Annual Sports Meet Scheduled for February 15th", category: "Event" },
        { id: 2, title: "New AI Research Lab Inaugurated in Computer Science Dept", category: "News" },
        { id: 3, title: "Library Hours Extended for Upcoming Midterms", category: "Notice" },
        { id: 4, title: "Registration Open for Summer Internships 2026", category: "Career" }
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/students/stats/overview');
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        const timer = setInterval(() => {
            setNewsIndex((prev) => (prev + 1) % newsArticles.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <h1 className="font-bold text-lg" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Dashboard Overview</h1>
      
      {/* Top Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div className="card">
            <h3 className="text-secondary text-sm">Total Students</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalStudents}</p>
        </div>
        <div className="card">
            <h3 className="text-secondary text-sm">Active Courses</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.activeCourses}</p>
        </div>
        <div className="card">
            <h3 className="text-secondary text-sm">Recent Enrollments</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.recentEnrollments}</p>
        </div>
        <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <CircleGauge value={stats.capacityPercentage} label="Capacity" color="var(--primary-color)" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Real-time News Feed */}
        <div className="card">
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                <h3 className="font-bold">Campus News & Updates</h3>
                <span className="badge badge-active">Live</span>
            </div>
            <div style={{ height: '80px', position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={newsArticles[newsIndex].id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'absolute', width: '100%' }}
                    >
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                            {newsArticles[newsIndex].category.toUpperCase()}
                        </span>
                        <p style={{ fontSize: '1rem', fontWeight: '500', marginTop: '0.25rem' }}>
                            {newsArticles[newsIndex].title}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="flex gap-1" style={{ marginTop: '1rem' }}>
                {newsArticles.map((_, i) => (
                    <div 
                        key={i} 
                        style={{ 
                            width: '20px', 
                            height: '3px', 
                            backgroundColor: i === newsIndex ? 'var(--primary-color)' : 'var(--border-color)',
                            borderRadius: '2px',
                            transition: 'background-color 0.3s'
                        }} 
                    />
                ))}
            </div>
        </div>

        {/* Shortcuts/Activity Segment */}
        <div className="card">
            <h3 className="font-bold" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <div className="flex flex-col gap-2">
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Generate Attendance Report</button>
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Update Course Schedule</button>
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Send Bulk Notification</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
