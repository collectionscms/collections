import dayjs from 'dayjs';
import jsonld from 'jsonld';
import { logger } from '../../utilities/logger.js';
import { AlumnusEntity } from '../persistence/alumnus/alumnus.entity.js';
import { AwardEntity } from '../persistence/award/award.entity.js';
import { ContentEntity } from '../persistence/content/content.entity.js';
import { ExperienceEntity } from '../persistence/experience/experience.entity.js';
import { ExperienceResourceEntity } from '../persistence/experienceResource/experienceResource.entity.js';
import { SocialProfileEntity } from '../persistence/socialProfile/socialProfile.entity.js';
import { SpokenLanguageEntity } from '../persistence/spokenLanguage/spokenLanguage.entity.js';
import { TagEntity } from '../persistence/tag/tag.entity.js';
import { UserEntity } from '../persistence/user/user.entity.js';

export class JsonLdService {
  async toBlogJsonLd({
    content,
    tags,
    user,
    spokenLanguages,
    awards,
    socialProfiles,
    alumni,
    experienceWithResources,
  }: {
    content: ContentEntity;
    tags: TagEntity[];
    user: UserEntity;
    spokenLanguages: SpokenLanguageEntity[];
    awards: AwardEntity[];
    socialProfiles: SocialProfileEntity[];
    alumni: AlumnusEntity[];
    experienceWithResources: {
      experience: ExperienceEntity;
      resources: ExperienceResourceEntity[];
    }[];
  }) {
    const doc = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      ...((content.title || content.metaTitle) && {
        name: content.metaTitle || content.title.slice(0, 160),
      }),
      ...(content.subtitle && {
        headline: content.subtitle,
      }),
      ...(content.publishedAt && {
        datePublished: dayjs(content.publishedAt).format('YYYY-MM-DDThh:mm:ssZ'),
      }),
      dateModified: dayjs(content.updatedAt).format('YYYY-MM-DDThh:mm:ssZ'),
      ...((content.metaDescription || content.body) && {
        description: content.metaDescription || content.body.slice(0, 160),
      }),
      inLanguage: content.language,
      ...(tags.length > 0 && {
        articleSection: tags.map((tag) => tag.name),
      }),
      author: {
        '@type': 'Person',
        name: user.name,
        ...(user.bio && {
          description: user.bio,
        }),
        ...(user.image && {
          image: {
            '@type': 'ImageObject',
            url: user.image,
          },
        }),
        ...(user.jobTitle && {
          jobTitle: user.jobTitle,
        }),
        ...(user.employer && {
          worksFor: {
            '@type': 'Organization',
            name: user.employer,
          },
        }),
        ...(spokenLanguages.length > 0 && {
          knowsLanguage: [
            ...spokenLanguages.map((spokenLanguage) => ({
              '@type': 'Language',
              name: spokenLanguage.language,
            })),
          ],
        }),
        ...(awards.length > 0 && {
          award: awards.map((award) => award.name),
        }),
        ...(socialProfiles.length > 0 || user.bioUrl
          ? {
              sameAs: [
                ...socialProfiles.map((socialProfile) => socialProfile.url),
                ...(user.bioUrl ? [user.bioUrl] : []),
              ],
            }
          : {}),
        ...(alumni.length > 0 && {
          alumniOf: [
            ...alumni.map((alumnus) => ({
              '@type': 'EducationalOrganization',
              name: alumnus.name,
              url: alumnus.url,
            })),
          ],
        }),
        ...(experienceWithResources.length > 0 && {
          knowsAbout: [
            ...experienceWithResources.map((experienceWithResource) => ({
              '@type': 'Thing',
              name: experienceWithResource.experience.name,
              url: experienceWithResource.experience.url,
              ...(experienceWithResource.resources.length > 0 && {
                sameAs: experienceWithResource.resources.map((resource) => resource.url),
              }),
            })),
          ],
        }),
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        ...((content.title || content.metaTitle) && {
          name: content.metaTitle || content.title.slice(0, 160),
        }),
        ...((content.metaDescription || content.body) && {
          description: content.metaDescription || content.body.slice(0, 160),
        }),
        inLanguage: content.language,
        ...(content.publishedAt && {
          datePublished: dayjs(content.publishedAt).format('YYYY-MM-DDThh:mm:ssZ'),
        }),
        dateModified: dayjs(content.updatedAt).format('YYYY-MM-DDThh:mm:ssZ'),
      },
    };

    try {
      await jsonld.expand(doc);
      return doc;
    } catch (error) {
      logger.error(error);
      return {};
    }
  }
}
