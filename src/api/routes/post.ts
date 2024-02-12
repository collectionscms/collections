import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { PostRepository } from '../data/post/post.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.get(
  '/posts',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;
    const projectId = res.user.projects[0].id;

    const repository = new PostRepository();
    const records = await repository.findManyByProjectId(prisma, projectId);

    const posts = records.map((record) => {
      return record.post.toResponse(locale, record.contents, record.createdBy);
    });

    res.json({ posts });
  })
);

export const post = router;
