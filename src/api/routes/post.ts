import express, { Request, Response } from 'express';
import { authenticatedUser } from '../middleware/auth.js';
import { env } from '../../env.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { PostRepository } from '../data/post/post.repository.js';
import { prisma } from '../database/prisma/client.js';

const router = express.Router();

router.get(
  '/posts',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;
    const projectId = res.user.projects[0].id;

    const repository = new PostRepository();
    const posts = await repository.findLocalizedPosts(prisma, projectId, locale);

    res.json({ posts });
  })
);

export const post = router;
