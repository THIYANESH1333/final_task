const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// @route   POST api/registrations/:eventId
// @desc    Register for an event
// @access  Private
router.post('/:eventId', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        let registration = await Registration.findOne({ event: req.params.eventId, user: req.user.id });
        if (registration) {
            return res.status(400).json({ msg: 'User already registered for this event' });
        }

        registration = new Registration({
            event: req.params.eventId,
            user: req.user.id
        });

        await registration.save();
        res.json(registration);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/registrations/:eventId
// @desc    Unregister from an event
// @access  Private
router.delete('/:eventId', auth, async (req, res) => {
    try {
        const registration = await Registration.findOne({ event: req.params.eventId, user: req.user.id });
        if (!registration) {
            return res.status(404).json({ msg: 'Registration not found' });
        }

        await registration.remove();
        res.json({ msg: 'Successfully unregistered from event' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/registrations
// @desc    Get all registrations for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user.id }).populate('event');
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get event registrations (admin only)
router.get('/event/:eventId', auth, admin, async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('volunteer', 'name email phone')
      .sort({ registeredAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark attendance (admin only)
router.put('/:id/attendance', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        attendedAt: status === 'attended' ? new Date() : null
      },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/registrations/all
// @desc    Get all registrations (for admin)
// @access  Private (Admin)
router.get('/all', [auth, admin], async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('event', ['title', 'date'])
            .populate('user', ['name', 'email']);
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 