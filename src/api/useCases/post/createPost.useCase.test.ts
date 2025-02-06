import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client.js';
import { buildContentEntity } from '../../persistence/content/content.entity.fixture.js';
import { InMemoryContentRepository } from '../../persistence/content/content.repository.mock.js';
import { InMemoryContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.mock.js';
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

  it('should return content with draft status', async () => {
    const postId = v4();

    jest.spyOn(InMemoryContentRepository.prototype, 'create').mockResolvedValue({
      content: buildContentEntity({
        postId,
      }),
      createdBy: buildUserEntity(),
    });

    const result = await createPostUseCase.execute({
      projectId,
      userId,
      sourceLanguage: 'ja',
    });

    expect(result).toMatchObject({
      postId,
      language: 'ja',
      status: {
        currentStatus: 'draft',
      },
    });
  });
});
