import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client.js';
import { InMemoryContentRepository } from '../../persistence/content/content.repository.mock.js';
import { InMemoryUserProjectRepository } from '../../persistence/userProject/userProject.repository.mock.js';
import { GetUserPublishedListContentsUseCase } from './getUserPublishedListContents.useCase.js';

describe('GetUserPublishedListContentsUseCase', () => {
  const projectId = v4();
  const useCase = new GetUserPublishedListContentsUseCase(
    projectPrisma(projectId),
    new InMemoryUserProjectRepository(),
    new InMemoryContentRepository()
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return published list contents for a given user', async () => {
    const records = await useCase.execute({
      projectId,
      id: v4(),
    });

    expect(records).toBeDefined();
  });

  it('should throw an error if user not found in the project', async () => {
    jest
      .spyOn(InMemoryUserProjectRepository.prototype, 'findOneWithRoleByUserId')
      .mockResolvedValue(null);

    await expect(useCase.execute({ projectId, id: v4() })).rejects.toThrow();
  });
});
