import { expect, jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client.js';
import { InMemoryContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.mock.js';
import { buildPostEntity } from '../../persistence/post/post.entity.fixture.js';
import { InMemoryPostRepository } from '../../persistence/post/post.repository.mock.js';
import { UpdateContentUseCase } from './updateContent.useCase.js';

describe('UpdateContentUseCase', () => {
  const contentId = v4();
  const projectId = v4();
  const userId = v4();
  let updateContentUseCase: UpdateContentUseCase;

  beforeEach(() => {
    updateContentUseCase = new UpdateContentUseCase(
      projectPrisma(projectId),
      new InMemoryContentRevisionRepository(),
      new InMemoryPostRepository()
    );
    jest.clearAllMocks();
  });

  it('should unset isInit on post if post.isInit is true', async () => {
    jest.spyOn(InMemoryPostRepository.prototype, 'findOneById').mockResolvedValue(
      buildPostEntity({
        isInit: true,
      })
    );
    const updateSpy = jest.spyOn(InMemoryPostRepository.prototype, 'update').mockResolvedValue(
      buildPostEntity({
        isInit: false,
      })
    );

    await updateContentUseCase.execute({
      id: contentId,
      projectId,
      userId,
    });

    expect(updateSpy).toHaveBeenCalled();
  });
});
