import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { ExperienceRepository } from '../persistence/experience/experience.repository.js';
import { CreateExperienceUseCase } from '../useCases/experience/createExperience.useCase.js';
import { createExperienceUseCaseSchema } from '../useCases/experience/createExperience.useCase.schema.js';

const router = express.Router();

router.post(
  '/experiences',
  authenticatedUser,
  validateAccess(['saveSeo']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createExperienceUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      experiences: req.body.experiences,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateExperienceUseCase(
      projectPrisma(validated.data.projectId),
      new ExperienceRepository(),
      new ExperienceResourceRepository()
    );
    const experiences = await useCase.execute(validated.data);

    res.json({ experiences });
  })
);

export const experience = router;
