import { useState, useEffect } from 'react';
import api from '@/utils/api.js';
import './Admin.css';

const AdminRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                setLoading(true);
                const res = await api.get('/registrations/all');
                setRegistrations(res.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch registrations.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    if (loading) return <div>Loading registrations...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-page">
            <h2>All Event Registrations</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Event Title</th>
                        <th>Event Date</th>
                        <th>Volunteer Name</th>
                        <th>Volunteer Email</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.length > 0 ? (
                        registrations.map(reg => (
                            <tr key={reg._id}>
                                <td>{reg.event?.title || 'N/A'}</td>
                                <td>{reg.event ? new Date(reg.event.date).toLocaleDateString() : 'N/A'}</td>
                                <td>{reg.user?.name || 'N/A'}</td>
                                <td>{reg.user?.email || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No registrations found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminRegistrations;
