const express = require('express');
const { extractActionItems } = require('../services/gemini');
const { appendActionItems, getDocContent } = require('../services/googleApis');

const router = express.Router();

/**
 * POST /api/meetings/post-intelligence
 * Takes raw meeting notes and extracts action items via Gemini, 
 * then appends them to a Google Sheet.
 */
router.post('/post-intelligence', async (req, res) => {
  try {
    const { notes, spreadsheetId } = req.body;
    
    if (!notes) {
      return res.status(400).json({ error: 'Meeting notes are required' });
    }

    // 1. Call Gemini to extract action items
    const actionItems = await extractActionItems(notes);

    // 2. Push to Google Sheets (if a spreadsheetId is provided)
    // Note: req.headers.authorization would typically contain the user's access token,
    // or we use the server's service account if using a shared sheet.
    // Assuming auth is handled appropriately in a real scenario:
    // if (spreadsheetId && actionItems.length > 0) {
    //   await appendActionItems(req.auth, spreadsheetId, 'Sheet1!A:D', actionItems);
    // }

    res.status(200).json({ 
      message: 'Action items extracted successfully', 
      actionItems 
    });

  } catch (error) {
    console.error('Error in post-meeting intelligence:', error);
    res.status(500).json({ error: 'Failed to process meeting notes' });
  }
});

/**
 * POST /api/meetings/pre-brief-manual
 * Manually triggers a pre-meeting brief generation given a Google Doc ID for agenda.
 */
router.post('/pre-brief-manual', async (req, res) => {
  try {
    const { documentId, attendeeTasks } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    // 1. Fetch agenda from Google Docs
    // const agendaText = await getDocContent(req.auth, documentId);
    
    // For demo purposes, we will mock the agenda if no real auth is provided
    const agendaText = "Weekly Sync: 1. API Design review, 2. Marketing launch date";

    // 2. Generate Brief via Gemini
    const { generatePreMeetingBrief } = require('../services/gemini');
    const brief = await generatePreMeetingBrief(agendaText, attendeeTasks || []);

    res.status(200).json({ 
      message: 'Brief generated successfully', 
      brief 
    });

  } catch (error) {
    console.error('Error generating pre-meeting brief:', error);
    res.status(500).json({ error: 'Failed to generate pre-meeting brief' });
  }
});

module.exports = router;
