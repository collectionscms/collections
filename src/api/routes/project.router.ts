import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ProjectRepository } from '../data/project/project.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { getProjectUseCaseSchema } from '../useCases/project/getProject.schema.js';
import { GetProjectUseCase } from '../useCases/project/getProject.useCase.js';
import { updateProjectUseCaseSchema } from '../useCases/project/updateProject.schema.js';
import { UpdateProjectUseCase } from '../useCases/project/updateProject.useCase.js';

const router = express.Router();

router.get(
  '/projects',
  authenticatedUser,
  validateAccess(['readProject']),
  asyncHandler(async (_req: Request, res: Response) => {
    const validated = getProjectUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetProjectUseCase(
      projectPrisma(validated.data.projectId),
      new ProjectRepository()
    );
    const project = await useCase.execute(validated.data.projectId);

    res.json({ project });
  })
);

router.patch(
  '/projects',
  authenticatedUser,
  validateAccess(['updateProject']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateProjectUseCaseSchema.safeParse({
      id: res.projectRole?.id,
      name: req.body.name,
      defaultLocale: req.body.defaultLocale,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const projectUseCase = new UpdateProjectUseCase(
      projectPrisma(validated.data.id),
      new ProjectRepository()
    );
    await projectUseCase.execute({
      id: validated.data.id,
      name: validated.data.name,
      defaultLocale: validated.data.defaultLocale,
    });

    res.status(204).end();
  })
);

export const project = router;
