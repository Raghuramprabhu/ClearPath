const express = require('express');
const { generateGentleNudge } = require('../services/gemini');

const router = express.Router();

/**
 * POST /api/nudge/check
 * Checks a task for staleness and generates a gentle nudge if needed.
 * This is the core of the psychological safety model — only the assignee sees this.
 */
router.post('/check', async (req, res) => {
  try {
    const { taskName, assigneeName, daysSinceUpdate, deadline } = req.body;

    if (!taskName || !assigneeName) {
      return res.status(400).json({ error: 'Task name and assignee name are required' });
    }

    const days = daysSinceUpdate || 3;
    const dueDate = deadline || 'soon';

    // Generate empathetic nudge via Gemini
    const nudge = await generateGentleNudge(taskName, assigneeName, days, dueDate);

    res.status(200).json({
      message: 'Gentle nudge generated',
      nudge,
      metadata: {
        taskName,
        assigneeName,
        daysSinceUpdate: days,
        deadline: dueDate,
        managerNotified: false, // Manager is NEVER notified at this stage
      },
    });
  } catch (error) {
    console.error('Error generating gentle nudge:', error);
    res.status(500).json({ error: 'Failed to generate gentle nudge' });
  }
});

/**
 * POST /api/nudge/respond
 * Handles the assignee's response to a gentle nudge.
 */
router.post('/respond', async (req, res) => {
  try {
    const { taskId, responseOption, taskName } = req.body;

    if (!responseOption) {
      return res.status(400).json({ error: 'Response option is required' });
    }

    let result = {};

    switch (responseOption) {
      case 'more_time':
        // Auto-reschedule task, update calendar
        result = {
          action: 'rescheduled',
          message: 'Task deadline extended. Take the time you need.',
          managerNotified: false,
        };
        break;

      case 'need_input':
        // Trigger Smart Help Scheduler
        result = {
          action: 'help_scheduled',
          message: 'Let\'s find someone who can help. Opening Smart Help Scheduler...',
          managerNotified: false,
          redirect: 'smart-help',
        };
        break;

      case 'need_support':
        // Escalate WITH context — not a red flag, a support request
        result = {
          action: 'support_requested',
          message: 'Your lead has been notified with full context. They\'re here to help, not judge.',
          managerNotified: true,
          contextProvided: true,
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid response option' });
    }

    res.status(200).json({
      message: 'Response recorded',
      taskId,
      ...result,
    });
  } catch (error) {
    console.error('Error processing nudge response:', error);
    res.status(500).json({ error: 'Failed to process response' });
  }
});

/**
 * POST /api/nudge/monitor
 * Simulates the monitoring engine that checks for stuck tasks.
 * In production, this would run as a scheduled Cloud Function or Pub/Sub trigger.
 */
router.post('/monitor', async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ error: 'Tasks array is required' });
    }

    const now = new Date();
    const stuckTasks = tasks.filter((task) => {
      if (task.status === 'completed') return false;
      const lastUpdate = new Date(task.lastUpdated);
      const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
      return daysSinceUpdate >= (task.nudgeThresholdDays || 3);
    });

    const nudges = [];
    for (const task of stuckTasks) {
      const lastUpdate = new Date(task.lastUpdated);
      const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
      const nudge = await generateGentleNudge(
        task.title,
        task.assignee,
        daysSinceUpdate,
        task.deadline || 'not set',
      );
      nudges.push({ taskId: task.id, ...nudge });
    }

    res.status(200).json({
      message: `Found ${stuckTasks.length} tasks needing attention`,
      totalTasks: tasks.length,
      stuckCount: stuckTasks.length,
      nudges,
    });
  } catch (error) {
    console.error('Error in nudge monitor:', error);
    res.status(500).json({ error: 'Failed to run nudge monitor' });
  }
});

module.exports = router;
