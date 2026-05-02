const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-1.5-pro';

/**
 * Helper function to call Gemini and ensure JSON response
 */
const generateJSON = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.2, // Low temperature for more deterministic JSON outputs
        }
    });
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate response from Gemini');
  }
};

/**
 * Pre-Meeting Brief
 */
const generatePreMeetingBrief = async (agendaText, attendeeTasks) => {
  const prompt = `
    You are a meeting preparation assistant. 
    Given this meeting agenda: ${agendaText} 
    and this attendee's current tasks: ${JSON.stringify(attendeeTasks)}, 
    generate a personalised 3-point meeting brief. 
    Format as JSON: { "points": [""], "prep_questions": [""], "time_estimate_saved_minutes": 15 }
  `;
  return generateJSON(prompt);
};

/**
 * Action Item Extraction
 */
const extractActionItems = async (meetingNotes) => {
  const prompt = `
    You are a meeting analyst. 
    Extract all action items from these meeting notes: 
    ${meetingNotes}
    
    For each action item return JSON object in an array format. 
    Return array only, no explanation.
    Array format: [{ "action": "string", "owner": "string", "deadline": "string", "priority": "high|medium|low" }]
  `;
  return generateJSON(prompt);
};

/**
 * Scheduling Intent Parser
 */
const parseSchedulingIntent = async (requestText) => {
  const prompt = `
    You are a scheduling assistant. 
    Parse this help request: "${requestText}". 
    Extract JSON: { "requester": "string", "needed_from": "string", "duration_minutes": 30, "topic": "string", "urgency": "high|medium|low" }. 
    Return JSON only.
  `;
  return generateJSON(prompt);
};

/**
 * Daily Schedule Recommendation
 */
const recommendDailySchedule = async (tasks, calendarBlocks) => {
  const prompt = `
    Given these tasks with deadlines: ${JSON.stringify(tasks)} 
    and these existing calendar blocks: ${JSON.stringify(calendarBlocks)}, 
    recommend an optimal daily schedule. 
    Prioritise deep work in morning hours.
    Return JSON array of time blocks: [{ "start_time": "ISO", "end_time": "ISO", "task_id": "string", "reason": "string" }].
  `;
  return generateJSON(prompt);
};

module.exports = {
  generatePreMeetingBrief,
  extractActionItems,
  parseSchedulingIntent,
  recommendDailySchedule
};
