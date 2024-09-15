import { LocalizedPost } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentHistoryRepository } from '../../persistence/contentHistory/contentHistory.repository.js';
import { PostRepository } from '../../persistence/post/post.repository.js';
import { ProjectRepository } from '../../persistence/project/project.repository.js';
import { GetPostUseCaseSchemaType } from './getPost.useCase.schema.js';

export class GetPostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly projectRepository: ProjectRepository,
    private readonly postRepository: PostRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: GetPostUseCaseSchemaType, hasReadAllPost: boolean): Promise<LocalizedPost> {
    const project = await this.projectRepository.findOneById(this.prisma, props.projectId);

    const options = hasReadAllPost ? undefined : { userId: props.userId };
    const { post, contents } = await this.postRepository.findOneWithContentsById(
      this.prisma,
      props.postId,
      options
    );

    const usedLanguages = [...new Set(contents.map((c) => c.content.language))];

    const languageContent = contents
      .filter((c) => c.content.language === props.language)
      .reduce((a, b) => (b.content.version > a.content.version ? b : a));

    const histories = await this.contentHistoryRepository.findManyByPostIdWithLanguage(
      this.prisma,
      post.id,
      languageContent.content.language
    );

    return post.toLocalizedPostResponse(
      project,
      usedLanguages,
      languageContent.content,
      languageContent.createdBy,
      languageContent.updatedBy,
      histories
    );
  }
}
