import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const StudentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userId: '', // Student ID
        email: '',
        phone: '',
        address: '',
        dob: '',
        course: '',
        enrollmentDate: '',
        status: 'Active',
        progress: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            const fetchStudent = async () => {
                try {
                    const { data } = await api.get(`/students/${id}`);
                    setFormData({
                        ...data,
                        userId: data.studentId, // Map backend studentId to form userId
                        dob: data.dob.split('T')[0], // Format date for input
                        enrollmentDate: data.enrollmentDate.split('T')[0]
                    });
                } catch (err) {
                    setError('Failed to fetch student details');
                }
            };
            fetchStudent();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Cleanup payload to match Student model exactly
        const { userId, ...rest } = formData;
        const payload = {
            ...rest,
            studentId: userId
        };

        try {
            if (isEditMode) {
                await api.put(`/students/${id}`, payload);
            } else {
                await api.post('/students', payload);
            }
            navigate('/students');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Operation failed. Please check student ID and email uniqueness.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <h1 className="font-bold text-lg" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{isEditMode ? 'Edit Student' : 'Add New'}</h1>
      
      <div className="card" style={{ maxWidth: '800px' }}>
        {error && <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }} className="grid-responsive">
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>First Name</label>
                    <input type="text" name="firstName" className="input" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Last Name</label>
                    <input type="text" name="lastName" className="input" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Student ID</label>
                    <input type="text" name="userId" className="input" value={formData.userId} onChange={handleChange} required disabled={isEditMode} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date of Birth</label>
                    <input type="date" name="dob" className="input" value={formData.dob} onChange={handleChange} required />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                    <input type="email" name="email" className="input" value={formData.email} onChange={handleChange} required />
                </div>
                 <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Phone</label>
                    <input type="tel" name="phone" className="input" value={formData.phone} onChange={handleChange} required />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Address</label>
                    <input type="text" name="address" className="input" value={formData.address} onChange={handleChange} required />
                </div>
            </div>

            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Enrollment Details</h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }} className="grid-responsive">
                 <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Course Enrolled</label>
                    <select name="course" className="input" value={formData.course} onChange={handleChange} required>
                        <option value="">Select Course</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Arts">Arts</option>
                    </select>
                </div>
                 <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Enrollment Date</label>
                    <input type="date" name="enrollmentDate" className="input" value={formData.enrollmentDate} onChange={handleChange} required />
                </div>
                 <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Status</label>
                    <select name="status" className="input" value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                    </select>
                </div>
                 <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        Progress Status: <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{formData.progress}%</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input 
                            type="range" 
                            name="progress" 
                            min="0" 
                            max="100" 
                            className="input" 
                            style={{ padding: '0', height: '8px', cursor: 'pointer' }}
                            value={formData.progress} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div style={{ backgroundColor: 'var(--border-color)', height: '4px', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                        <div style={{ width: `${formData.progress}%`, backgroundColor: 'var(--primary-color)', height: '100%', transition: 'width 0.3s ease' }}></div>
                    </div>
                </div>
             </div>

             <div className="flex gap-4" style={{ justifyContent: 'flex-end' }}>
                 <button type="button" className="btn btn-outline" onClick={() => navigate('/students')}>Cancel</button>
                 <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Submit Student'}</button>
             </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
