import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ApiKeyRepository } from '../data/apiKey/apiKey.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { getApiKeysUseCaseSchema } from '../useCases/apiKey/getApiKeys.schema.js';
import { GetApiKeysUseCase } from '../useCases/apiKey/getApiKeys.useCase.js';

const router = express.Router();

router.get(
  '/api-keys',
  authenticatedUser,
  validateAccess(['readApiKey']),
  asyncHandler(async (_req: Request, res: Response) => {
    const validated = getApiKeysUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetApiKeysUseCase(
      projectPrisma(validated.data.projectId),
      new ApiKeyRepository()
    );
    const apiKeys = await useCase.execute();

    res.json({
      apiKeys,
    });
  })
);

export const apiKey = router;
