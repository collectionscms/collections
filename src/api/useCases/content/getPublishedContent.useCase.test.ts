import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client.js';
import { buildAlumnusEntity } from '../../persistence/alumnus/alumnus.entity.fixture.js';
import { buildAwardEntity } from '../../persistence/award/award.entity.fixture.js';
import { InMemoryContentRepository } from '../../persistence/content/content.repository.mock.js';
import { buildContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.fixture.js';
import { InMemoryContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.mock.js';
import { InMemoryContentTagRepository } from '../../persistence/contentTag/contentTag.repository.mock.js';
import { buildExperienceEntity } from '../../persistence/experience/experience.entity.fixture.js';
import { buildExperienceResourceEntity } from '../../persistence/experienceResource/experienceResource.entity.fixture.js';
import { buildSocialProfileEntity } from '../../persistence/socialProfile/socialProfile.entity.fixture.js';
import { buildSpokenLanguageEntity } from '../../persistence/spokenLanguage/spokenLanguage.entity.fixture.js';
import { buildUserEntity } from '../../persistence/user/user.entity.fixture.js';
import { InMemoryUserRepository } from '../../persistence/user/user.repository.mock.js';
import { JsonLdService } from '../../services/jsonLd.service.js';
import { GetPublishedContentUseCase } from './getPublishedContent.useCase.js';
import { buildContentEntity } from '../../persistence/content/content.entity.fixture.js';
import dayjs from 'dayjs';
import { buildTagEntity } from '../../persistence/tag/tag.entity.fixture.js';

describe('GetPublishedContentUseCase', () => {
  const projectId = v4();
  const useCase = new GetPublishedContentUseCase(
    projectPrisma(projectId),
    new InMemoryContentRepository(),
    new InMemoryContentTagRepository(),
    new InMemoryContentRevisionRepository(),
    new InMemoryUserRepository(),
    new JsonLdService()
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
        content: {
          slug: 'slug',
          status: 'published',
        },
      });
    });

    it('should return published content by id', async () => {
      const id = v4();
      const record = await useCase.execute({
        projectId,
        identifier: id,
      });

      expect(record).toMatchObject({
        content: {
          id,
          status: 'published',
        },
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
        content: {
          slug: 'slug',
          status: 'draft',
        },
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
        content: {
          id: contentId,
          status: 'draft',
        },
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
        .mockResolvedValue(
          buildContentRevisionEntity({
            draftKey: 'anotherDraftKey',
          })
        );

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

  describe('return jsonLd', () => {
    it('should return valid jsonLd structure', async () => {
      jest.spyOn(InMemoryContentRepository.prototype, 'findOneBySlug').mockResolvedValue(
        buildContentEntity({
          title: 'sample post',
          language: 'ja',
          body: 'My first blog!',
          metaTitle: '',
          metaDescription: '',
          slug: 'slug',
          updatedAt: dayjs('2024-12-31').toDate(),
          publishedAt: dayjs('2025-01-01').toDate(),
        })
      );

      jest
        .spyOn(InMemoryContentTagRepository.prototype, 'findTagsByContentId')
        .mockResolvedValue([
          buildTagEntity({ name: 'react' }),
          buildTagEntity({ name: 'typescript' }),
        ]);

      jest.spyOn(InMemoryUserRepository.prototype, 'findOneWithProfilesById').mockResolvedValue({
        user: buildUserEntity({
          name: 'John Doe',
          image: 'https://example.com/image.jpg',
          bio: 'bio',
          jobTitle: 'ceo',
          employer: 'Banana',
        }),
        socialProfiles: [
          buildSocialProfileEntity({
            url: 'https://x.com/john_doe',
          }),
          buildSocialProfileEntity({
            url: 'https://www.facebook.com/john_doe',
          }),
        ],
        alumni: [
          buildAlumnusEntity({
            name: 'SEO',
            url: 'https://www.seo.com',
          }),
        ],
        spokenLanguages: [
          buildSpokenLanguageEntity({
            language: 'ja',
          }),
        ],
        awards: [
          buildAwardEntity({
            name: 'Black Belt',
          }),
        ],
        experienceWithResources: [
          {
            experience: buildExperienceEntity({
              name: 'react',
              url: 'https://react.dev',
            }),
            resources: [
              buildExperienceResourceEntity({
                url: 'https://github.com/facebook/react',
              }),
            ],
          },
        ],
      });

      const record = await useCase.execute({
        projectId,
        identifier: 'slug',
      });

      expect(record).toMatchObject({
        jsonLd: {
          name: 'sample post',
          headline: 'sample post',
          description: 'My first blog!',
          inLanguage: 'ja',
          dateModified: '2024-12-31',
          datePublished: '2025-01-01',
          articleSection: ['react', 'typescript'],
          author: {
            name: 'John Doe',
            description: 'bio',
            jobTitle: 'ceo',
            worksFor: {
              name: 'Banana',
            },
            image: {
              url: 'https://example.com/image.jpg',
            },
            knowsLanguage: [
              {
                name: 'ja',
              },
            ],
            award: ['Black Belt'],
            sameAs: ['https://x.com/john_doe', 'https://www.facebook.com/john_doe'],
            alumniOf: [
              {
                name: 'SEO',
                url: 'https://www.seo.com',
              },
            ],
            knowsAbout: [
              {
                name: 'react',
                url: 'https://react.dev',
                sameAs: ['https://github.com/facebook/react'],
              },
            ],
          },
        },
      });
    });

    it('should use meta fields for jsonLd when provided', async () => {
      jest.spyOn(InMemoryContentRepository.prototype, 'findOneBySlug').mockResolvedValue(
        buildContentEntity({
          title: 'title',
          body: 'body',
          metaTitle: 'meta title',
          metaDescription: 'meta description',
        })
      );

      const record = await useCase.execute({
        projectId,
        identifier: 'slug',
      });

      expect(record).toMatchObject({
        jsonLd: {
          name: 'meta title',
          headline: 'meta title',
          description: 'meta description',
        },
      });
    });
  });
});
