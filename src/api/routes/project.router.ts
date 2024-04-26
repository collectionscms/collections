import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ProjectRepository } from '../data/project/project.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { updateProjectUseCaseSchema } from '../useCases/project/updateProject.schema.js';
import { UpdateProjectUseCase } from '../useCases/project/updateProject.useCase.js';

const router = express.Router();

router.get(
  '/projects',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const id = res.user.projects[0].id;

    const repository = new ProjectRepository();
    const result = await repository.findOneById(projectPrisma(id), id);

    res.json({ project: result.toResponse() });
  })
);

router.patch(
  '/projects',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = res.user.projects[0].id;

    const validated = updateProjectUseCaseSchema.safeParse({
      id,
      ...req.body,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const projectUseCase = new UpdateProjectUseCase(projectPrisma(id), new ProjectRepository());
    await projectUseCase.execute(validated.data.id, {
      name: validated.data.name,
    });

    res.status(204).end();
  })
);

export const project = router;
