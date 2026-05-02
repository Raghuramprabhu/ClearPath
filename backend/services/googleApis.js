const { google } = require('googleapis');

// Helper to get authenticated Google API clients
const getGoogleClients = (auth) => {
  return {
    calendar: google.calendar({ version: 'v3', auth }),
    docs: google.docs({ version: 'v1', auth }),
    sheets: google.sheets({ version: 'v4', auth }),
    slides: google.slides({ version: 'v1', auth }),
    tasks: google.tasks({ version: 'v1', auth }),
  };
};

/**
 * Calendar API
 */
const getFreeSlots = async (auth, emails, timeMin, timeMax) => {
  const { calendar } = getGoogleClients(auth);
  
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: emails.map(id => ({ id })),
    },
  });
  
  return response.data.calendars;
};

const createMeeting = async (auth, { summary, description, startTime, endTime, attendees }) => {
  const { calendar } = getGoogleClients(auth);
  
  const event = {
    summary,
    description,
    start: { dateTime: startTime },
    end: { dateTime: endTime },
    attendees: attendees.map(email => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: event,
  });

  return response.data;
};

/**
 * Docs API
 */
const getDocContent = async (auth, documentId) => {
  const { docs } = getGoogleClients(auth);
  const response = await docs.documents.get({ documentId });
  
  // Basic text extraction from doc elements
  let content = '';
  const elements = response.data.body?.content || [];
  elements.forEach(el => {
    if (el.paragraph) {
      el.paragraph.elements.forEach(textRun => {
        if (textRun.textRun && textRun.textRun.content) {
          content += textRun.textRun.content;
        }
      });
    }
  });
  
  return content;
};

/**
 * Sheets API
 */
const appendActionItems = async (auth, spreadsheetId, range, items) => {
  const { sheets } = getGoogleClients(auth);
  
  // Items format expected: [[action, owner, deadline, priority]]
  const values = items.map(item => [item.action, item.owner, item.deadline, item.priority]);
  
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
  
  return response.data;
};

const getActionItems = async (auth, spreadsheetId, range) => {
  const { sheets } = getGoogleClients(auth);
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return response.data.values || [];
};

/**
 * Slides API
 */
const getSlideThumbnails = async (auth, presentationId) => {
  const { slides } = getGoogleClients(auth);
  const response = await slides.presentations.pages.getThumbnail({
    presentationId,
    pageObjectId: 'p', // 'p' usually refers to the first slide/title page
  });
  return response.data.contentUrl;
};

/**
 * Tasks API
 */
const createTask = async (auth, tasklistId = '@default', { title, notes, due }) => {
  const { tasks } = getGoogleClients(auth);
  
  const response = await tasks.tasks.insert({
    tasklist: tasklistId,
    requestBody: {
      title,
      notes,
      due, // RFC 3339 timestamp
    },
  });
  
  return response.data;
};

module.exports = {
  getFreeSlots,
  createMeeting,
  getDocContent,
  appendActionItems,
  getActionItems,
  getSlideThumbnails,
  createTask
};
