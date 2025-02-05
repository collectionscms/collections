import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { ExperienceRepository } from '../persistence/experience/experience.repository.js';
import { ExperienceResourceRepository } from '../persistence/experienceResource/experienceResource.repository.js';
import { CreateExperienceUseCase } from '../useCases/experience/createExperience.useCase.js';
import { createExperienceUseCaseSchema } from '../useCases/experience/createExperience.useCase.schema.js';
import { GetExperiencesUseCase } from '../useCases/experience/getExperiences.useCase.js';
import { getExperiencesUseCaseSchema } from '../useCases/experience/getExperiences.useCase.schema.js';

const router = express.Router();

router.get(
  '/experiences',
  authenticatedUser,
  validateAccess(['readSeo']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getExperiencesUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetExperiencesUseCase(
      projectPrisma(validated.data.projectId),
      new ExperienceRepository()
    );
    const experiences = await useCase.execute();

    res.json({ experiences });
  })
);

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
