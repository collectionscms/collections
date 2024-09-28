import { ProjectPrismaType } from '../database/prisma/client.js';
import { ContentRepository } from '../persistence/content/content.repository.js';

export class ContentService {
  constructor(private readonly contentRepository: ContentRepository) {}

  async isUniqueSlug(prisma: ProjectPrismaType, contentId: string, slug: string): Promise<boolean> {
    const encodedSlug = encodeURIComponent(slug);
    const sameSlugContent = await this.contentRepository.findOneBySlug(prisma, encodedSlug);

    if (!sameSlugContent) return true;
    if (sameSlugContent.content.id === contentId) return true;

    return false;
  }
}
