import express, { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';

const router = express.Router();

router.get(
  '/webhook-settings',
  authenticatedUser,
  validateAccess(['readWebhookSetting']),
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      webhookSettings: [],
    });
  })
);

export const webhookSetting = router;
