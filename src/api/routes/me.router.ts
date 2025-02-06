import { getSession } from '@auth/express';
import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { authConfig } from '../configs/auth.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { AlumnusRepository } from '../persistence/alumnus/alumnus.repository.js';
import { AwardRepository } from '../persistence/award/award.repository.js';
import { SocialProfileRepository } from '../persistence/socialProfile/socialProfile.repository.js';
import { SpokenLanguageRepository } from '../persistence/spokenLanguage/spokenLanguage.repository.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import { UserExperienceRepository } from '../persistence/userExperience/userExperience.repository.js';
import { UserProjectRepository } from '../persistence/userProject/userProject.repository.js';
import { GetMyProfileUseCase } from '../useCases/me/getMyProfile.useCase.js';
import { getMyProfileUseCaseSchema } from '../useCases/me/getMyProfile.useCase.schema.js';
import { GetMyProjectExperiencesUseCase } from '../useCases/me/getMyProjectExperiences.useCase.js';
import { getMyProjectExperiencesUseCaseSchema } from '../useCases/me/getMyProjectExperiences.useCase.schema.js';
import { GetMyProjectsUseCase } from '../useCases/me/getMyProjects.useCase.js';
import { getMyProjectsUseCaseSchema } from '../useCases/me/getMyProjects.useCase.schema.js';
import { UpdateProfileUseCase } from '../useCases/me/updateProfile.useCase.js';
import { updateProfileUseCaseSchema } from '../useCases/me/updateProfile.useCase.schema.js';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const user = res.user ?? (await getSession(req, authConfig))?.user;

    return res.json({
      me: user || null,
    });
  })
);

router.get(
  '/me/profile',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getMyProfileUseCaseSchema.safeParse({
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetMyProfileUseCase(bypassPrisma, new UserRepository());
    const authorProfile = await useCase.execute(validated.data.userId);

    return res.json(authorProfile);
  })
);

router.get(
  '/me/projects',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getMyProjectsUseCaseSchema.safeParse({
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetMyProjectsUseCase(bypassPrisma, new UserRepository());
    const projects = await useCase.execute(validated.data.userId);

    return res.json(projects);
  })
);

router.get(
  '/me/project-experiences',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const validated = getMyProjectExperiencesUseCaseSchema.safeParse({
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetMyProjectExperiencesUseCase(bypassPrisma, new UserProjectRepository());
    const projectExperiences = await useCase.execute(validated.data);

    res.json({ projectExperiences });
  })
);

router.patch(
  '/me',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateProfileUseCaseSchema.safeParse({
      userId: res.user.id,
      name: req.body.name,
      bio: req.body.bio,
      bioUrl: req.body.bioUrl,
      employer: req.body.employer,
      jobTitle: req.body.jobTitle,
      image: req.body.image,
      xUrl: req.body.xUrl,
      instagramUrl: req.body.instagramUrl,
      facebookUrl: req.body.facebookUrl,
      linkedInUrl: req.body.linkedInUrl,
      awards: req.body.awards,
      spokenLanguages: req.body.spokenLanguages,
      alumni: req.body.alumni,
      experiences: req.body.experiences,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateProfileUseCase(
      bypassPrisma,
      new UserRepository(),
      new AwardRepository(),
      new AlumnusRepository(),
      new SocialProfileRepository(),
      new SpokenLanguageRepository(),
      new UserExperienceRepository(),
      new UserProjectRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).end();
  })
);

export const me = router;
