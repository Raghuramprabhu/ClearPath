const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-1.5-pro';

/**
 * Helper function to call Gemini and ensure JSON response.
 * Uses low temperature for deterministic structured output.
 */
const generateJSON = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate response from Gemini');
  }
};

/**
 * Pre-Meeting Brief — generates a personalised 3-point brief per attendee
 */
const generatePreMeetingBrief = async (agendaText, attendeeTasks, attendeeRole = 'team member') => {
  const prompt = `
    You are a meeting preparation assistant for ClearPath.
    Given this meeting agenda: ${agendaText}
    This attendee's role: ${attendeeRole}
    Their current tasks: ${JSON.stringify(attendeeTasks)}
    
    Generate a personalised 3-point meeting brief.
    Return JSON only: {
      "points": ["string", "string", "string"],
      "prep_questions": ["string", "string"],
      "time_estimate_saved_minutes": number,
      "key_context": "string"
    }
  `;
  return generateJSON(prompt);
};

/**
 * Action Item Extraction — parses raw meeting notes into structured items
 */
const extractActionItems = async (meetingNotes) => {
  const prompt = `
    You are a meeting analyst for ClearPath.
    Extract all action items from these meeting notes:
    ${meetingNotes}
    
    For each action item return a JSON object in an array.
    Return array only, no explanation.
    Format: [{ "action": "string", "owner": "string", "deadline": "string", "priority": "high"|"medium"|"low" }]
  `;
  return generateJSON(prompt);
};

/**
 * Scheduling Intent Parser — extracts who, what, when from natural language
 */
const parseSchedulingIntent = async (requestText) => {
  const prompt = `
    You are a scheduling assistant for ClearPath.
    Parse this help request: "${requestText}".
    Extract JSON: {
      "requester": "string",
      "needed_from": "string",
      "duration_minutes": number,
      "topic": "string",
      "urgency": "high"|"medium"|"low"
    }
    Return JSON only.
  `;
  return generateJSON(prompt);
};

/**
 * Daily Schedule Recommendation — optimal day planning from tasks + calendar
 */
const recommendDailySchedule = async (tasks, calendarBlocks) => {
  const prompt = `
    You are a productivity coach for ClearPath.
    Given these tasks with deadlines: ${JSON.stringify(tasks)}
    and these existing calendar blocks: ${JSON.stringify(calendarBlocks)},
    recommend an optimal daily schedule for today.
    Prioritise deep work before noon, meetings in afternoon.
    Return JSON array: [{
      "start_time": "HH:MM",
      "end_time": "HH:MM",
      "task_id": "string",
      "task_title": "string",
      "reason": "string",
      "type": "deep_work"|"meeting"|"break"|"admin"
    }]
  `;
  return generateJSON(prompt);
};

/**
 * Gentle Nudge — empathetic private check-in for stuck tasks
 */
const generateGentleNudge = async (taskName, assigneeName, daysSinceUpdate, deadline) => {
  const prompt = `
    You are an empathetic work companion for ClearPath's Gentle Nudge system.
    Task "${taskName}" assigned to ${assigneeName} has not been updated in ${daysSinceUpdate} days
    and is due ${deadline}.
    
    Write a private, supportive check-in message offering three options:
    1. I need more time
    2. I need input from someone
    3. I need support
    
    Tone: warm, never accusatory, never managerial. This is a check-in, not a follow-up.
    
    Return JSON: {
      "message": "string (the empathetic check-in message)",
      "options": [
        { "id": "more_time", "label": "I need more time", "action": "reschedule" },
        { "id": "need_input", "label": "I need input from someone", "action": "schedule_help" },
        { "id": "need_support", "label": "I need support", "action": "escalate_with_context" }
      ],
      "tone_check": "supportive"
    }
  `;
  return generateJSON(prompt);
};

/**
 * Ippo Task Breakdown — splits overwhelming tasks into momentum-friendly steps
 */
const generateIppoBreakdown = async (taskDescription, isNeurodivergentMode = false) => {
  const modeContext = isNeurodivergentMode
    ? 'The user has opted into neurodivergent support mode. Use extra supportive language, celebrate small wins, and make the first step extremely small (under 5 minutes). Never use guilt language.'
    : 'Break the task into approachable steps. First step should be completable in under 10 minutes.';

  const prompt = `
    You are Ippo, a task intelligence companion in ClearPath.
    You understand cognitive load and help build momentum.
    
    ${modeContext}
    
    Break this task into momentum-friendly steps: "${taskDescription}"
    Maximum 5 steps.
    
    Return JSON: {
      "original_task": "string",
      "steps": [
        {
          "step_number": number,
          "step": "string",
          "effort_minutes": number,
          "momentum_starter": boolean,
          "celebration_message": "string"
        }
      ],
      "momentum_tip": "string",
      "estimated_total_minutes": number
    }
  `;
  return generateJSON(prompt);
};

/**
 * Ippo Recovery Protocol — for when task initiation fails
 */
const generateIppoRecovery = async (taskDescription) => {
  const prompt = `
    You are Ippo, a supportive task companion in ClearPath.
    The user is struggling to start this task: "${taskDescription}"
    
    Generate a recovery protocol with supportive, no-guilt framing:
    1. Acknowledge the difficulty
    2. Suggest a brief pause (breathe)
    3. Physical reset (hydrate, move)
    4. Brain dump prompt
    5. Grounding exercise
    
    Then suggest the absolute smallest first action they could take.
    
    Return JSON: {
      "acknowledgement": "string",
      "recovery_steps": [
        { "step": "string", "duration_seconds": number, "icon": "string" }
      ],
      "momentum_starter": "string",
      "encouragement": "string"
    }
  `;
  return generateJSON(prompt);
};

module.exports = {
  generatePreMeetingBrief,
  extractActionItems,
  parseSchedulingIntent,
  recommendDailySchedule,
  generateGentleNudge,
  generateIppoBreakdown,
  generateIppoRecovery,
};
