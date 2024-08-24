import { File } from '@prisma/client';
import { env } from '../../../env.js';
import { bypassPrisma, BypassPrismaClient } from '../../database/prisma/client.js';
import { FileEntity } from '../../persistence/file/file.entity.js';
import { FileRepository } from '../../persistence/file/file.repository.js';
import { ProjectRepository } from '../../persistence/project/project.repository.js';

type CreateFileUseCaseResponse = {
  files: Array<File & { url: string }>;
};

export class CreateFileUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly fileRepository: FileRepository,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute(projectId: string | null, files: FileEntity[]): Promise<CreateFileUseCaseResponse> {
    const subdomain = projectId
      ? (await this.projectRepository.findOneById(bypassPrisma, projectId)).subdomain
      : env.PUBLIC_PORTAL_SUBDOMAIN;

    const result = await this.prisma.$transaction(async (tx) => {
      const createdFiles = [];
      for (const file of files) {
        const entity = await this.fileRepository.create(tx, file);
        createdFiles.push(entity);
      }

      return createdFiles;
    });

    return {
      files: result.map((file) => {
        return file.toResponseWithUrl(subdomain);
      }),
    };
  }
}
