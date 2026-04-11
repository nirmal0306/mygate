const Event = require('../models/Event');
const axios = require('axios');

const resolveMapAddress = async (mapUrl) => {
  try {
    if (!mapUrl) return 'Map Location';

    // follow redirect of maps.app.goo.gl
    const response = await axios.get(mapUrl, {
      maxRedirects: 5,
      validateStatus: s => s >= 200 && s < 400
    });

    const finalUrl = response.request.res.responseUrl;

    /* 🔥 STEP 1: Extract place name directly */
    const placeMatch = finalUrl.match(/\/place\/([^/]+)/);

    if (placeMatch) {
      return decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
    }

    /* 🔥 STEP 2: Extract coordinates */
    const coordMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

    if (!coordMatch) return 'Map Location';

    const lat = coordMatch[1];
    const lon = coordMatch[2];

    /* 🔥 STEP 3: Reverse geocode using OpenStreetMap */
    const osm = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          lat,
          lon,
          format: 'json'
        },
        headers: {
          'User-Agent': 'MyGate-App'
        }
      }
    );

    const addr = osm.data.address || {};

    return (
      addr.restaurant ||
      addr.amenity ||
      addr.building ||
      addr.tourism ||
      addr.shop ||
      addr.leisure ||
      osm.data.name ||
      osm.data.display_name?.split(',')[0]?.trim() ||
      'Map Location'
    );

  } catch (err) {
    console.error('Map resolve error:', err.message);
    return 'Map Location';
  }
};

/* ================= CREATE EVENT ================= */
exports.createEvent = async (req, res) => {
  try {
    // 🔥 AUTO RESOLVE ADDRESS
    if (req.body?.venue?.mapUrl) {
      req.body.venue.address = await resolveMapAddress(
        req.body.venue.mapUrl
      );
    }

    const event = new Event(req.body);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET ALL EVENTS ================= */
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET SINGLE EVENT ================= */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= UPDATE EVENT ================= */
exports.updateEvent = async (req, res) => {
  try {
    // 🔥 RE-RESOLVE ADDRESS IF MAP URL CHANGED
    if (req.body?.venue?.mapUrl) {
      req.body.venue.address = await resolveMapAddress(
        req.body.venue.mapUrl
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= DELETE EVENT ================= */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
