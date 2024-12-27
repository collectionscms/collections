import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client.js';
import { buildContentEntity } from '../../persistence/content/content.entity.fixture.js';
import { InMemoryContentTagRepository } from '../../persistence/contentTag/contentTag.repository.mock.js';
import { InMemoryTagRepository } from '../../persistence/tag/tag.repository.mock.js';
import { buildUserEntity } from '../../persistence/user/user.entity.fixture.js';
import { GetTagPublishedListContentsUseCase } from './getTagPublishedListContents.useCase.js';

describe('GetTagPublishedListContentsUseCase', () => {
  const projectId = v4();
  const useCase = new GetTagPublishedListContentsUseCase(
    projectPrisma(projectId),
    new InMemoryTagRepository(),
    new InMemoryContentTagRepository()
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return published list contents for a given tag', async () => {
    const records = await useCase.execute({
      tagName: 'tag',
      projectId,
    });

    expect(records).toBeDefined();
  });

  it('should return published list contents for a given tag and language', async () => {
    jest
      .spyOn(InMemoryContentTagRepository.prototype, 'findPublishedContentsByTagId')
      .mockResolvedValue([
        {
          content: buildContentEntity({ language: 'en-us' }),
          createdBy: buildUserEntity(),
        },
        {
          content: buildContentEntity({ language: 'ja' }),
          createdBy: buildUserEntity(),
        },
      ]);

    const records = await useCase.execute({
      tagName: 'tag',
      projectId,
      language: 'en-us',
    });

    const allLanguagesMatch = records.every((record) => record.language === 'en-us');
    expect(allLanguagesMatch).toBe(true);
    expect(records).toHaveLength(1);
  });

  it('should throw an error if no published contents are found for the given tag', async () => {
    jest.spyOn(InMemoryTagRepository.prototype, 'findOneByName').mockResolvedValue(null);

    await expect(
      useCase.execute({
        tagName: 'tag',
        projectId,
      })
    ).rejects.toThrow();
  });
});
