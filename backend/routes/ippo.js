const express = require('express');
const { generateIppoBreakdown, generateIppoRecovery } = require('../services/gemini');

const router = express.Router();

/**
 * POST /api/ippo/breakdown
 * Breaks a complex task into momentum-friendly steps.
 * Supports optional neurodivergent mode for extra supportive framing.
 */
router.post('/breakdown', async (req, res) => {
  try {
    const { taskDescription, neurodivergentMode } = req.body;

    if (!taskDescription) {
      return res.status(400).json({ error: 'Task description is required' });
    }

    const breakdown = await generateIppoBreakdown(
      taskDescription,
      neurodivergentMode || false,
    );

    res.status(200).json({
      message: 'Task broken down successfully',
      breakdown,
      mode: neurodivergentMode ? 'supportive' : 'standard',
    });
  } catch (error) {
    console.error('Error in Ippo breakdown:', error);
    res.status(500).json({ error: 'Failed to break down task' });
  }
});

/**
 * POST /api/ippo/recovery
 * Generates a recovery protocol when task initiation fails.
 * This is private — team and managers never see this layer.
 */
router.post('/recovery', async (req, res) => {
  try {
    const { taskDescription } = req.body;

    if (!taskDescription) {
      return res.status(400).json({ error: 'Task description is required' });
    }

    const recovery = await generateIppoRecovery(taskDescription);

    res.status(200).json({
      message: 'Recovery protocol generated',
      recovery,
      private: true, // Team and managers never see this
    });
  } catch (error) {
    console.error('Error in Ippo recovery:', error);
    res.status(500).json({ error: 'Failed to generate recovery protocol' });
  }
});

/**
 * POST /api/ippo/complete
 * Celebrates task or sub-task completion with a dopamine-friendly response.
 */
router.post('/complete', async (req, res) => {
  try {
    const { taskTitle, stepNumber, totalSteps, isFullComplete } = req.body;

    // Celebration responses based on progress
    const celebrations = [
      '🎯 First step done! Momentum is building.',
      '⚡ You\'re on a roll! Keep that energy flowing.',
      '🌟 Halfway there! Look at you go.',
      '🚀 Almost done! The finish line is right there.',
      '🎉 Complete! You crushed it. Take a moment to feel that.',
    ];

    const celebrationIndex = isFullComplete
      ? celebrations.length - 1
      : Math.min(stepNumber - 1, celebrations.length - 2);

    res.status(200).json({
      message: celebrations[celebrationIndex],
      progress: {
        completed: stepNumber,
        total: totalSteps,
        percentComplete: Math.round((stepNumber / totalSteps) * 100),
      },
      isFullComplete: isFullComplete || false,
    });
  } catch (error) {
    console.error('Error in Ippo completion:', error);
    res.status(500).json({ error: 'Failed to process completion' });
  }
});

module.exports = router;
