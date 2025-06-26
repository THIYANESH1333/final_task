import { useState, useEffect } from 'react';
import api from '@/utils/api.js';
import Modal from '@/components/Modal';
import './Admin.css';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        maxVolunteers: 10,
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await api.get('/events');
            setEvents(res.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch events.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (event = null) => {
        setCurrentEvent(event);
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                date: new Date(event.date).toISOString().split('T')[0], // Format for date input
                location: event.location,
                maxVolunteers: event.maxVolunteers,
            });
        } else {
            setFormData({ title: '', description: '', date: '', location: '', maxVolunteers: 10 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentEvent(null);
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert dd-mm-yyyy to yyyy-mm-dd for backend
            let [day, month, year] = formData.date.split('-');
            const isoDate = `${year}-${month}-${day}`;
            const payload = {
                ...formData,
                date: isoDate,
            };
            if (currentEvent) {
                await api.put(`/events/${currentEvent._id}`, payload);
            } else {
                await api.post('/events', payload);
            }
            fetchEvents();
            handleCloseModal();
        } catch (err) {
            alert(`Failed to ${currentEvent ? 'update' : 'create'} event.`);
            console.error(err);
        }
    };
    const deleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${eventId}`);
                fetchEvents();
            } catch (err) {
                alert('Failed to delete event.');
                console.error(err);
            }
        }
    };

    if (loading) return <div>Loading events...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h2>Manage Events</h2>
                <button onClick={() => handleOpenModal()} className="btn-primary">Create Event</button>
            </div>
            
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event._id}>
                            <td>{event.title}</td>
                            <td>{new Date(event.date).toLocaleDateString()}</td>
                            <td>{event.location}</td>
                            <td>
                                <button onClick={() => handleOpenModal(event)} className="btn-secondary">Edit</button>
                                <button onClick={() => deleteEvent(event._id)} className="btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentEvent ? 'Edit Event' : 'Create Event'}>
                <form onSubmit={handleSubmit} className="modal-form">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
                    <input type="number" name="maxVolunteers" value={formData.maxVolunteers} onChange={handleChange} placeholder="Max Volunteers" required />
                    <button type="submit">{currentEvent ? 'Update' : 'Create'}</button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminEvents;
