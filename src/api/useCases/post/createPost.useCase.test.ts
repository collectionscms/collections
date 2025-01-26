import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client.js';
import { buildContentEntity } from '../../persistence/content/content.entity.fixture.js';
import { InMemoryContentRepository } from '../../persistence/content/content.repository.mock.js';
import { buildContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.fixture.js';
import { InMemoryContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.mock.js';
import { buildPostEntity } from '../../persistence/post/post.entity.fixture.js';
import { InMemoryPostRepository } from '../../persistence/post/post.repository.mock.js';
import { InMemoryProjectRepository } from '../../persistence/project/project.repository.mock.js';
import { buildUserEntity } from '../../persistence/user/user.entity.fixture.js';
import { CreatePostUseCase } from './createPost.useCase.js';

describe('CreatePostUseCase', () => {
  const projectId = v4();
  const userId = v4();
  let createPostUseCase: CreatePostUseCase;

  const prisma = projectPrisma(projectId);
  jest.spyOn(prisma, '$transaction').mockImplementation(async (fn) => {
    return await fn(prisma);
  });

  beforeEach(() => {
    createPostUseCase = new CreatePostUseCase(
      prisma,
      new InMemoryProjectRepository(),
      new InMemoryPostRepository(),
      new InMemoryContentRepository(),
      new InMemoryContentRevisionRepository()
    );
    jest.clearAllMocks();
  });

  it('should create a new post successfully', async () => {
    jest.spyOn(InMemoryPostRepository.prototype, 'findOneByIsInit').mockResolvedValue(null);
    const createSpy = jest.spyOn(InMemoryContentRepository.prototype, 'create').mockResolvedValue({
      content: buildContentEntity({
        projectId,
        language: 'ja',
        createdById: userId,
      }),
      createdBy: buildUserEntity(),
    });

    const result = await createPostUseCase.execute({
      projectId,
      userId,
      sourceLanguage: 'ja',
    });

    expect(createSpy).toHaveBeenCalled();
    expect(result).toMatchObject({
      language: 'ja',
    });
  });

  it('should return init post if initPost exists', async () => {
    const contentId = v4();

    jest.spyOn(InMemoryPostRepository.prototype, 'findOneByIsInit').mockResolvedValue({
      post: buildPostEntity({
        isInit: true,
      }),
      content: buildContentEntity({
        id: contentId,
      }),
      revision: buildContentRevisionEntity({}),
    });

    const result = await createPostUseCase.execute({
      projectId,
      userId,
      sourceLanguage: 'ja',
    });

    expect(result).toMatchObject({
      id: contentId,
    });
  });
});
