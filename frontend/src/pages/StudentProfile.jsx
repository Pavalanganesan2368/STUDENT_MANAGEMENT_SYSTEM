import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MdArrowBack, MdEdit, MdEmail, MdPhone, MdLocationOn, MdCake, MdSchool, MdEvent } from 'react-icons/md';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        let endpoint = `/students/${id}`;
        
        // If no ID is provided (e.g., from "/profile" link), 
        // fetch the student profile using the current user's email
        if (!id && user) {
          const { data: studentsData } = await api.get(`https://student-management-system-backend-pdb4.onrender.com/students?search=${user.email}`);
          if (studentsData.students && studentsData.students.length > 0) {
            setStudent(studentsData.students[0]);
            setLoading(false);
            return;
          } else {
            setError('Student profile not found for this user');
            setLoading(false);
            return;
          }
        }

        const { data } = await api.get(endpoint);
        setStudent(data);
      } catch (err) {
        setError('Failed to fetch student profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user || id) {
      fetchStudent();
    }
  }, [id, user]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Profile...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger-color)' }}>{error}</div>;
  if (!student) return <div style={{ padding: '2rem', textAlign: 'center' }}>Student not found</div>;

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <div className="flex items-center gap-4" style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate('/students')} className="btn btn-outline" style={{ padding: '0.5rem' }}>
          <MdArrowBack size={20} />
        </button>
        <h1 className="font-bold text-lg" style={{ fontSize: '1.5rem' }}>Student Profile</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem' }} className="grid-responsive">
        {/* Left Column: Avatar & Basic Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary-color)', 
                color: 'white', 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
            }}>
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <h2 className="font-bold text-lg">{student.firstName} {student.lastName}</h2>
            <p className="text-secondary" style={{ marginBottom: '0.5rem' }}>ID: {student.studentId}</p>
            <span className={`badge ${student.status === 'Active' ? 'badge-active' : student.status === 'Inactive' ? 'badge-inactive' : 'badge-pending'}`}>
              {student.status}
            </span>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Link to={`/students/edit/${student._id}`} className="btn btn-primary" style={{ flex: 1 }}>
                    <MdEdit style={{ marginRight: '0.5rem' }} /> Edit
                </Link>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MdEmail className="text-secondary" />
                <span className="text-sm">{student.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MdPhone className="text-secondary" />
                <span className="text-sm">{student.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MdLocationOn className="text-secondary" />
                <span className="text-sm">{student.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Academic & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 className="font-bold" style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Academic Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <p className="text-secondary text-sm">Course</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <MdSchool style={{ color: 'var(--primary-color)' }} />
                  <span style={{ fontWeight: '500' }}>{student.course}</span>
                </div>
              </div>
              <div>
                <p className="text-secondary text-sm">Enrollment Date</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <MdEvent style={{ color: 'var(--primary-color)' }} />
                  <span style={{ fontWeight: '500' }}>{new Date(student.enrollmentDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <p className="text-secondary text-sm">Birth Date</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <MdCake style={{ color: 'var(--primary-color)' }} />
                  <span style={{ fontWeight: '500' }}>{new Date(student.dob).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <p className="text-secondary text-sm">GPA / Performance</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                   <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{student.gpa || '0.0'}</span>
                   <span className="text-secondary text-sm">/ 4.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="font-bold" style={{ fontSize: '1.125rem' }}>Learning Progress</h3>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)', marginLeft: 'auto' }}>{student.progress || 0}%</span>
            </div>
            <div style={{ backgroundColor: 'var(--border-color)', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ 
                    width: `${student.progress || 0}%`, 
                    backgroundColor: 'var(--primary-color)', 
                    height: '100%',
                    transition: 'width 0.8s ease'
                }}></div>
            </div>
            <p className="text-sm text-secondary">
                This student has completed {student.progress || 0}% of their current academic requirements for the {student.course} course.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Academic Credits</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{student.credits || 0}</span>
                <span className="text-secondary">Credits Earned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
