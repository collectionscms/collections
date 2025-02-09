import dayjs from 'dayjs';
import { buildAlumnusEntity } from '../persistence/alumnus/alumnus.entity.fixture';
import { buildAwardEntity } from '../persistence/award/award.entity.fixture';
import { buildContentEntity } from '../persistence/content/content.entity.fixture';
import { buildExperienceEntity } from '../persistence/experience/experience.entity.fixture';
import { buildExperienceResourceEntity } from '../persistence/experienceResource/experienceResource.entity.fixture';
import { buildSocialProfileEntity } from '../persistence/socialProfile/socialProfile.entity.fixture';
import { buildSpokenLanguageEntity } from '../persistence/spokenLanguage/spokenLanguage.entity.fixture';
import { buildTagEntity } from '../persistence/tag/tag.entity.fixture';
import { buildUserEntity } from '../persistence/user/user.entity.fixture';
import { JsonLdService } from './jsonLd.service.js';

describe('JsonLdService', () => {
  const jsonLdService = new JsonLdService();

  describe('return jsonLd', () => {
    const updatedAt = dayjs().subtract(1, 'day').hour(0).minute(0).second(0).millisecond(0);
    const publishedAt = dayjs().hour(0).minute(0).second(0).millisecond(0);

    it('should return valid jsonLd structure', async () => {
      const result = await jsonLdService.toBlogJsonLd({
        content: buildContentEntity({
          title: 'sample post',
          language: 'ja',
          subtitle: 'subtitle',
          body: 'My first blog!',
          metaTitle: '',
          metaDescription: '',
          slug: 'slug',
          updatedAt: updatedAt.toDate(),
          publishedAt: publishedAt.toDate(),
        }),
        tags: [buildTagEntity({ name: 'react' }), buildTagEntity({ name: 'typescript' })],
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

      expect(result).toMatchObject({
        name: 'sample post',
        headline: 'subtitle',
        description: 'My first blog!',
        inLanguage: 'ja',
        dateModified: updatedAt.format('YYYY-MM-DDThh:mm:ssZ'),
        datePublished: publishedAt.format('YYYY-MM-DDThh:mm:ssZ'),
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
      });
    });

    it('should use meta fields for jsonLd when provided', async () => {
      const result = await jsonLdService.toBlogJsonLd({
        content: buildContentEntity({
          title: 'title',
          body: 'body',
          metaTitle: 'meta title',
          metaDescription: 'meta description',
        }),
        tags: [],
        user: buildUserEntity(),
        spokenLanguages: [],
        awards: [],
        socialProfiles: [],
        alumni: [],
        experienceWithResources: [],
      });

      expect(result).toMatchObject({
        name: 'meta title',
        description: 'meta description',
      });
    });
  });
});
