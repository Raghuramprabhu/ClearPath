const express = require('express');
const { parseSchedulingIntent, recommendDailySchedule } = require('../services/gemini');
const { getFreeSlots, createMeeting } = require('../services/googleApis');

const router = express.Router();

/**
 * POST /api/scheduler/smart-help
 * Parses natural language to find and book a meeting between team members.
 */
router.post('/smart-help', async (req, res) => {
  try {
    const { requestText } = req.body;

    if (!requestText) {
      return res.status(400).json({ error: 'Request text is required' });
    }

    // 1. Parse intent with Gemini
    const intent = await parseSchedulingIntent(requestText);

    // Expected intent format: { requester, needed_from, duration_minutes, topic, urgency }
    
    // 2. In a real app, look up emails from users' names via a DB
    const emails = [`${intent.requester}@example.com`, `${intent.needed_from}@example.com`];
    
    // 3. Find free slots using Google Calendar API
    // const timeMin = new Date().toISOString();
    // const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    // const freeSlots = await getFreeSlots(req.auth, emails, timeMin, timeMax);
    
    // 4. For demo purposes, we return a mocked proposed slot
    const proposedSlot = {
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      endTime: new Date(Date.now() + (2 * 60 + intent.duration_minutes) * 60 * 1000).toISOString(),
      attendees: emails,
      summary: `Help session: ${intent.topic}`
    };

    res.status(200).json({ 
      message: 'Found optimal slot', 
      intent,
      proposedSlot
    });

  } catch (error) {
    console.error('Error in smart help scheduler:', error);
    res.status(500).json({ error: 'Failed to process scheduling request' });
  }
});

/**
 * POST /api/scheduler/daily-offload
 * Recommends an optimal daily schedule based on tasks and calendar.
 */
router.post('/daily-offload', async (req, res) => {
  try {
    const { tasks, calendarBlocks } = req.body;

    // Call Gemini to generate the schedule
    const recommendedSchedule = await recommendDailySchedule(tasks || [], calendarBlocks || []);

    res.status(200).json({ 
      message: 'Schedule generated successfully', 
      schedule: recommendedSchedule 
    });

  } catch (error) {
    console.error('Error generating daily schedule:', error);
    res.status(500).json({ error: 'Failed to generate daily schedule' });
  }
});

module.exports = router;
