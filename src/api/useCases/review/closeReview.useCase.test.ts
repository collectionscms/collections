/* eslint-disable max-len */
import { expect, jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client.js';
import { buildContentEntity } from '../../persistence/content/content.entity.fixture.js';
import { buildContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.fixture.js';
import { InMemoryContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.mock.js';
import { buildReviewEntity } from '../../persistence/review/review.entity.fixture.js';
import { InMemoryReviewRepository } from '../../persistence/review/review.repository.mock.js';
import { buildUserEntity } from '../../persistence/user/user.entity.fixture.js';
import { CloseReviewUseCase } from './closeReview.useCase.js';

describe('CloseReviewUseCase', () => {
  const projectId = v4();
  const reviewId = v4();
  const userId = v4();

  const prisma = projectPrisma(projectId);
  jest.spyOn(prisma, '$transaction').mockImplementation(async (fn) => {
    return await fn(prisma);
  });

  const useCase = new CloseReviewUseCase(
    prisma,
    new InMemoryReviewRepository(),
    new InMemoryContentRevisionRepository()
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('it has readAllReview permission', () => {
    it('should close the review, and the content revision status should be set to draft', async () => {
      const hasReadAllReview = true;
      const isAdmin = true;

      const result = await useCase.execute(
        { projectId, userId, reviewId, isAdmin, permissions: [] },
        hasReadAllReview
      );

      expect(result).toMatchObject({
        revision: {
          status: 'draft',
        },
        review: {
          status: 'closed',
        },
      });
    });

    it('should throw an error if the review not found', async () => {
      jest
        .spyOn(InMemoryReviewRepository.prototype, 'findOneWithContentAndParticipant')
        .mockResolvedValue(null);

      const hasReadAllReview = true;
      const isAdmin = true;

      await expect(
        useCase.execute({ projectId, userId, reviewId, isAdmin, permissions: [] }, hasReadAllReview)
      ).rejects.toThrow();
    });

    it('should throw an error if the content revision not found', async () => {
      jest
        .spyOn(InMemoryReviewRepository.prototype, 'findOwnOneWithContentAndParticipant')
        .mockResolvedValue({
          review: buildReviewEntity(),
          content: buildContentEntity(),
          reviewee: buildUserEntity(),
          reviewer: buildUserEntity(),
        });
      jest
        .spyOn(InMemoryContentRevisionRepository.prototype, 'findLatestOneByContentId')
        .mockResolvedValue(null);

      const hasReadAllReview = true;
      const isAdmin = true;

      await expect(
        useCase.execute({ projectId, userId, reviewId, isAdmin, permissions: [] }, hasReadAllReview)
      ).rejects.toThrow();
    });
  });

  describe('it has not readAllReview permission', () => {
    it('should close the review, and the content revision status should be set to draft', async () => {
      jest
        .spyOn(InMemoryContentRevisionRepository.prototype, 'findLatestOneByContentId')
        .mockResolvedValue(buildContentRevisionEntity());

      const hasReadAllReview = false;
      const isAdmin = false;

      const result = await useCase.execute(
        { projectId, userId, reviewId, isAdmin, permissions: [] },
        hasReadAllReview
      );

      expect(result).toMatchObject({
        revision: {
          status: 'draft',
        },
        review: {
          status: 'closed',
        },
      });
    });

    it('should throw an error if the review not found', async () => {
      jest
        .spyOn(InMemoryReviewRepository.prototype, 'findOwnOneWithContentAndParticipant')
        .mockResolvedValue(null);

      const hasReadAllReview = false;
      const isAdmin = false;

      await expect(
        useCase.execute({ projectId, userId, reviewId, isAdmin, permissions: [] }, hasReadAllReview)
      ).rejects.toThrow();
    });

    it('should throw an error if the content revision not found', async () => {
      jest
        .spyOn(InMemoryReviewRepository.prototype, 'findOwnOneWithContentAndParticipant')
        .mockResolvedValue({
          review: buildReviewEntity(),
          content: buildContentEntity(),
          reviewee: buildUserEntity(),
          reviewer: buildUserEntity(),
        });
      jest
        .spyOn(InMemoryContentRevisionRepository.prototype, 'findLatestOneByContentId')
        .mockResolvedValue(null);

      const hasReadAllReview = false;
      const isAdmin = false;

      await expect(
        useCase.execute({ projectId, userId, reviewId, isAdmin, permissions: [] }, hasReadAllReview)
      ).rejects.toThrow();
    });
  });
});
