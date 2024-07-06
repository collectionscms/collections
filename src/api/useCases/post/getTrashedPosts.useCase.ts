import { PostRepository } from '../../data/post/post.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetTrashedPostsUseCaseSchemaType } from './getTrashedPosts.schema.js';

type GetTrashedPostsUseCaseResponse = {
  id: string;
  title: string;
};

export class GetTrashedPostsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly postRepository: PostRepository
  ) {}

  async execute({
    primaryLocale,
  }: GetTrashedPostsUseCaseSchemaType): Promise<GetTrashedPostsUseCaseResponse[]> {
    const records = await this.postRepository.findManyTrashedByProjectId(this.prisma);

    return records.map((record) => {
      const localeContents = record.contents.filter((c) => c.content.locale === primaryLocale);
      const localeContent = localeContents.sort((a, b) => b.content.version - a.content.version)[0];

      return {
        id: record.post.id,
        title: localeContent.content.title,
      };
    });
  }
}
