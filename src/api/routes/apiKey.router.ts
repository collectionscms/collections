import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ApiKeyRepository } from '../data/apiKey/apiKey.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { getApiKeyUseCaseSchema } from '../useCases/apiKey/getApiKey.schema.js';
import { GetApiKeyUseCase } from '../useCases/apiKey/getApiKey.useCase.js';
import { getApiKeysUseCaseSchema } from '../useCases/apiKey/getApiKeys.schema.js';
import { GetApiKeysUseCase } from '../useCases/apiKey/getApiKeys.useCase.js';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';

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

router.get(
  '/api-keys/:id',
  authenticatedUser,
  validateAccess(['readApiKey']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getApiKeyUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      apiKeyId: req.params.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetApiKeyUseCase(
      projectPrisma(validated.data.projectId),
      new ApiKeyRepository()
    );
    const apiKey = await useCase.execute(validated.data);

    res.json({ apiKey });
  })
);

export const apiKey = router;
