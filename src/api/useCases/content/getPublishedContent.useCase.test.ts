/* eslint-disable max-len */
import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client.js';
import { InMemoryContentRepository } from '../../persistence/content/content.repository.mock.js';
import { buildContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.fixture.js';
import { InMemoryContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.mock.js';
import { InMemoryContentTagRepository } from '../../persistence/contentTag/contentTag.repository.mock.js';
import { buildUserEntity } from '../../persistence/user/user.entity.fixture.js';
import { GetPublishedContentUseCase } from './getPublishedContent.useCase.js';

describe('GetPublishedContentUseCase', () => {
  const projectId = v4();
  const useCase = new GetPublishedContentUseCase(
    projectPrisma(projectId),
    new InMemoryContentRepository(),
    new InMemoryContentTagRepository(),
    new InMemoryContentRevisionRepository()
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('return published content', () => {
    it('should return published content by slug', async () => {
      const record = await useCase.execute({
        projectId,
        identifier: 'slug',
      });

      expect(record).toMatchObject({
        slug: 'slug',
        status: 'published',
      });
    });

    it('should return published content by id', async () => {
      const id = v4();
      const record = await useCase.execute({
        projectId,
        identifier: id,
      });

      expect(record).toMatchObject({
        id,
        status: 'published',
      });
    });

    it('should throw an error if no published content is found for the given slug', async () => {
      jest.spyOn(InMemoryContentRepository.prototype, 'findOneBySlug').mockResolvedValue(null);

      await expect(
        useCase.execute({
          projectId,
          identifier: 'slug',
        })
      ).rejects.toMatchObject({
        code: 'record_not_found',
      });
    });
  });

  describe('return draft content', () => {
    it('should return draft content by slug and draft key', async () => {
      const record = await useCase.execute({
        projectId,
        identifier: 'slug',
        draftKey: 'draftKey',
      });

      expect(record).toMatchObject({
        slug: 'slug',
        status: 'draft',
      });
    });

    it('should return draft content by id and draft key', async () => {
      const contentId = v4();
      const record = await useCase.execute({
        projectId,
        identifier: contentId,
        draftKey: 'draftKey',
      });

      expect(record).toMatchObject({
        id: contentId,
        status: 'draft',
      });
    });

    it('should throw an error if no draft content is found for the given slug and draft key', async () => {
      jest
        .spyOn(InMemoryContentRevisionRepository.prototype, 'findLatestOneBySlug')
        .mockResolvedValue(null);

      await expect(
        useCase.execute({
          projectId,
          identifier: 'slug',
          draftKey: 'draftKey',
        })
      ).rejects.toMatchObject({
        code: 'record_not_found',
      });
    });

    it('should throw an error if the draft key does not match the draft content', async () => {
      jest
        .spyOn(InMemoryContentRevisionRepository.prototype, 'findLatestOneBySlug')
        .mockResolvedValue({
          contentRevision: buildContentRevisionEntity({
            draftKey: 'anotherDraftKey',
          }),
          createdBy: buildUserEntity(),
        });

      await expect(
        useCase.execute({
          projectId,
          identifier: 'slug',
          draftKey: 'draftKey',
        })
      ).rejects.toMatchObject({
        code: 'record_not_found',
      });
    });
  });
});
