import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete, MdVisibility, MdFilterList } from 'react-icons/md';
import api from '../utils/api';
import { NavLink, Link } from 'react-router-dom';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await api.get('/students');
                setStudents(data.students);
            } catch (error) {
                console.error("Error fetching students", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/${id}`);
                setStudents(students.filter(student => student._id !== id));
            } catch (error) {
                console.error("Error deleting student", error);
                alert('Failed to delete student');
            }
        }
    };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h1 className="font-bold text-lg" style={{ fontSize: '1.5rem' }}>Students</h1>
        <Link to="/students/new" className="btn btn-primary" style={{ padding: '0.5rem' }}>+ Add</Link>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
            <input type="text" placeholder="Search students..." className="input" style={{ maxWidth: '300px' }} />
            <div className="flex gap-2">
                <button className="btn btn-outline"><MdFilterList /> Filter</button>
                <button className="btn btn-outline">Bulk Actions</button>
            </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '600px', width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'var(--background-color)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Progress</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Enrollment Status</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{student.studentId}</td>
                <td style={{ padding: '1rem' }}>{student.firstName} {student.lastName}</td>
                <td style={{ padding: '1rem' }}>{student.email}</td>
                <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${student.progress || 0}%`, backgroundColor: 'var(--primary-color)', height: '100%' }}></div>
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{student.progress || 0}%</span>
                    </div>
                </td>
                <td style={{ padding: '1rem' }}>
                    <span className={`badge ${student.status === 'Active' ? 'badge-active' : student.status === 'Inactive' ? 'badge-inactive' : 'badge-pending'}`}>
                        {student.status}
                    </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                    <Link to={`/students/${student._id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}><MdVisibility /></Link>
                    <Link to={`/students/edit/${student._id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}><MdEdit /></Link>
                    <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.25rem 0.5rem', color: 'var(--danger-color)' }}
                        onClick={() => handleDelete(student._id)}
                    >
                        <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default StudentList;
