import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ApiKeyRepository } from '../persistence/apiKey/apiKey.repository.js';
import { ApiKeyPermissionRepository } from '../persistence/apiKeyPermission/apiKeyPermission.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { createApiKeyUseCaseSchema } from '../useCases/apiKey/createApiKey.schema.js';
import { CreateApiKeyUseCase } from '../useCases/apiKey/createApiKey.useCase.js';
import { deleteApiKeyUseCaseSchema } from '../useCases/apiKey/deleteApiKey.schema.js';
import { DeleteApiKeyUseCase } from '../useCases/apiKey/deleteApiKey.useCase.js';
import { getApiKeyUseCaseSchema } from '../useCases/apiKey/getApiKey.schema.js';
import { GetApiKeyUseCase } from '../useCases/apiKey/getApiKey.useCase.js';
import { getApiKeysUseCaseSchema } from '../useCases/apiKey/getApiKeys.schema.js';
import { GetApiKeysUseCase } from '../useCases/apiKey/getApiKeys.useCase.js';
import { updateApiKeyUseCaseSchema } from '../useCases/apiKey/updateApiKey.schema.js';
import { UpdateApiKeyUseCase } from '../useCases/apiKey/updateApiKey.useCase.js';

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

router.post(
  '/api-keys',
  authenticatedUser,
  validateAccess(['createApiKey']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createApiKeyUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      name: req.body.name,
      createdById: res.user?.id,
      permissions: req.body.permissions,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateApiKeyUseCase(
      projectPrisma(validated.data.projectId),
      new ApiKeyRepository(),
      new ApiKeyPermissionRepository()
    );
    const apiKey = await useCase.execute(validated.data);

    res.json({ apiKey });
  })
);

router.patch(
  '/api-keys/:id',
  authenticatedUser,
  validateAccess(['updateApiKey']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateApiKeyUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      apiKeyId: req.params.id,
      name: req.body.name,
      key: req.body.key,
      permissions: req.body.permissions,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateApiKeyUseCase(
      projectPrisma(validated.data.projectId),
      new ApiKeyRepository(),
      new ApiKeyPermissionRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).end();
  })
);

router.delete(
  '/api-keys/:id',
  authenticatedUser,
  validateAccess(['deleteApiKey']),
  asyncHandler(async (req: Request, res: Response) => {
    const validate = deleteApiKeyUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      apiKeyId: req.params.id,
    });
    if (!validate.success) throw new InvalidPayloadException('bad_request', validate.error);

    const useCase = new DeleteApiKeyUseCase(
      projectPrisma(validate.data.projectId),
      new ApiKeyRepository()
    );
    await useCase.execute(validate.data);

    res.status(204).end();
  })
);

export const apiKey = router;
