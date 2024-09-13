import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ProjectRepository } from '../persistence/project/project.repository.js';
import { RoleRepository } from '../persistence/role/role.repository.js';
import { UserProjectRepository } from '../persistence/userProject/userProject.repository.js';
import { bypassPrisma, projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { createProjectUseCaseSchema } from '../useCases/project/createProject.schema.js';
import { CreateProjectUseCase } from '../useCases/project/createProject.useCase.js';
import { getProjectUseCaseSchema } from '../useCases/project/getProject.schema.js';
import { GetProjectUseCase } from '../useCases/project/getProject.useCase.js';
import { updateProjectUseCaseSchema } from '../useCases/project/updateProject.schema.js';
import { UpdateProjectUseCase } from '../useCases/project/updateProject.useCase.js';

const router = express.Router();

router.get(
  '/my/projects',
  authenticatedUser,
  validateAccess(['readProject']),
  asyncHandler(async (_req: Request, res: Response) => {
    const validated = getMyProjectUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetMyProjectUseCase(
      projectPrisma(validated.data.projectId),
      new ProjectRepository()
    );
    const project = await useCase.execute(validated.data.projectId);

    res.json({ project });
  })
);

router.post(
  '/projects',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createProjectUseCaseSchema.safeParse({
      userId: res.user.id,
      name: req.body.name,
      sourceLanguage: req.body.sourceLanguage,
      subdomain: req.body.subdomain,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateProjectUseCase(
      bypassPrisma,
      new ProjectRepository(),
      new UserProjectRepository(),
      new RoleRepository()
    );
    const project = await useCase.execute(validated.data);

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
      sourceLanguage: req.body.sourceLanguage,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const projectUseCase = new UpdateProjectUseCase(
      projectPrisma(validated.data.id),
      new ProjectRepository()
    );
    await projectUseCase.execute({
      id: validated.data.id,
      name: validated.data.name,
      sourceLanguage: validated.data.sourceLanguage,
    });

    res.status(204).end();
  })
);

export const project = router;
