import express, { Request, Response } from 'express';
import { ProjectEntity } from '../data/project/project.entity.js';
import { ProjectRepository } from '../data/project/project.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.get(
  '/projects',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const id = res.locals.session.user.projects[0].id;

    const repository = new ProjectRepository();
    const project = await repository.findProject(prisma, id);

    res.json({ project });
  })
);

router.patch(
  '/projects',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = res.locals.session.user.projects[0].id;

    const repository = new ProjectRepository();
    const project = await repository.findProject(prisma, id);
    const entity = ProjectEntity.Reconstruct({
      ...project,
      name: req.body.name,
      description: req.body.description,
    });

    await repository.update(prisma, id, entity);

    res.status(204).end();
  })
);

export const project = router;
