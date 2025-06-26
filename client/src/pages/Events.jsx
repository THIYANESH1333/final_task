/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import '../styles/pages.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (err) {
                setError('Could not fetch events.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <div>Loading events...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="events-page">
            <h1>Upcoming Events</h1>
            <div className="events-list">
                {events.length > 0 ? (
                    events.map(event => (
                        <EventCard key={event._id} event={event} />
                    ))
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </div>
    );
};

export default Events; 