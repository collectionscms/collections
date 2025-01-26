import { expect, jest } from '@jest/globals';
import { v4 } from 'uuid';
import { bypassPrisma } from '../../database/prisma/client.js';
import { InMemoryApiKeyRepository } from '../../persistence/apiKey/apiKey.repository.mock.js';
import { InMemoryApiKeyPermissionRepository } from '../../persistence/apiKeyPermission/apiKeyPermission.repository.mock.js';
import { InMemoryProjectRepository } from '../../persistence/project/project.repository.mock.js';
import { InMemoryRoleRepository } from '../../persistence/role/role.repository.mock.js';
import { InMemoryUserProjectRepository } from '../../persistence/userProject/userProject.repository.mock.js';
import { CreateProjectUseCase } from './createProject.useCase';

describe('CreateProject', () => {
  const userId = v4();
  const reservedSubdomain = 'app';

  const prisma = bypassPrisma;
  jest.spyOn(prisma, '$transaction').mockImplementation(async (fn) => {
    return await fn(prisma);
  });

  const useCase = new CreateProjectUseCase(
    prisma,
    new InMemoryProjectRepository(),
    new InMemoryUserProjectRepository(),
    new InMemoryRoleRepository(),
    new InMemoryApiKeyRepository(),
    new InMemoryApiKeyPermissionRepository()
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the subdomain is not reserved', () => {
    it('should create a project', async () => {
      const result = await useCase.execute({
        userId,
        name: 'project name',
        sourceLanguage: 'en-us',
        subdomain: 'new-subdomain',
      });

      expect(result).toMatchObject({
        name: 'project name',
        sourceLanguage: 'en-us',
        subdomain: 'new-subdomain',
      });
    });

    it('should throw an error if project already exists', async () => {
      await expect(
        useCase.execute({
          userId,
          name: 'project name',
          sourceLanguage: 'en-us',
          subdomain: reservedSubdomain,
        })
      ).rejects.toMatchObject({
        code: 'already_registered_project_id',
      });
    });
  });

  describe('when the subdomain is reserved', () => {
    jest.spyOn(InMemoryProjectRepository.prototype, 'findOneBySubdomain').mockResolvedValue(null);

    it('should throw an error if the subdomain is a reserved subdomain', async () => {
      await expect(
        useCase.execute({
          userId,
          name: 'project name',
          sourceLanguage: 'en-us',
          subdomain: reservedSubdomain,
        })
      ).rejects.toMatchObject({
        code: 'already_registered_project_id',
      });
    });
  });
});
