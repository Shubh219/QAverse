import express from 'express';
import { isValidHttpUrl } from '../utils/urlValidator.js';
import { inspectWebsite } from '../services/websiteInspector.js';
import { generateTestPlan } from '../agents/testPlanner.js';

const router = express.Router();

/**
 * POST /api/test-planner/plan
 * 
 * Endpoint for the Gemini-powered Test Planner Agent.
 * 1. Validates websiteUrl and optional testingGoal.
 * 2. Inspects target website headlessly via Playwright.
 * 3. Invokes Test Planner Agent to generate structured test cases.
 * 4. Returns stable JSON plan containing website metadata and test cases.
 */
router.post('/plan', async (req, res, next) => {
  try {
    const { websiteUrl, testingGoal } = req.body || {};

    // 1. Validate required websiteUrl
    if (!websiteUrl || typeof websiteUrl !== 'string' || !websiteUrl.trim()) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'websiteUrl is required.'
      });
    }

    const trimmedUrl = websiteUrl.trim();

    // 2. Validate URL protocol (must be http:// or https://)
    if (!isValidHttpUrl(trimmedUrl)) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'websiteUrl must be a valid HTTP or HTTPS URL (e.g., https://example.com).'
      });
    }

    // 3. Validate optional testingGoal if provided
    if (testingGoal !== undefined && testingGoal !== null && typeof testingGoal !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'testingGoal must be a string if provided.'
      });
    }

    const trimmedGoal = typeof testingGoal === 'string' ? testingGoal.trim() : null;

    // 4. Inspect website via Playwright headless browser
    let inspectionData;
    try {
      inspectionData = await inspectWebsite(trimmedUrl);
    } catch (inspectError) {
      console.error('[Inspection Error]', inspectError.message);
      return res.status(502).json({
        success: false,
        error: 'InspectionError',
        message: `Failed to inspect website: ${inspectError.message}`
      });
    }

    // 5. Generate structured test cases via Gemini Test Planner Agent
    let planResult;
    try {
      planResult = await generateTestPlan(inspectionData, trimmedGoal);
    } catch (agentError) {
      console.error('[Test Planner Agent Error]', agentError.message);
      return res.status(500).json({
        success: false,
        error: 'PlanningError',
        message: agentError.message
      });
    }

    // 6. Return structured test plan
    return res.status(200).json({
      success: true,
      status: 'planned',
      summary: planResult.summary,
      website: {
        url: inspectionData.requestedUrl,
        finalUrl: inspectionData.finalUrl,
        title: inspectionData.title,
        statusCode: inspectionData.statusCode,
        inspectedAt: inspectionData.inspectedAt
      },
      testCases: planResult.testCases
    });
  } catch (error) {
    next(error);
  }
});

export default router;
