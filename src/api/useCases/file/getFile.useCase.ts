import { File } from '@prisma/client';
import { FileRepository } from '../../persistences/file/file.repository.js';
import { BypassPrismaClient, ProjectPrismaType } from '../../database/prisma/client.js';

type GetFileUseCaseResponse = {
  file: File & { url: string };
};

export class GetFileUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(projectId: string | null, fileId: string): Promise<GetFileUseCaseResponse> {
    const entity = await this.fileRepository.findFile(this.prisma, projectId, fileId);

    return {
      file: entity.toResponseWithUrl(),
    };
  }
}
