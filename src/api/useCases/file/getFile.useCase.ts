import { File } from '@prisma/client';
import { FileRepository } from '../../persistences/file/file.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

type GetFileUseCaseResponse = {
  file: File & { url: string };
};

export class GetFileUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(fileId: string): Promise<GetFileUseCaseResponse> {
    const entity = await this.fileRepository.findFile(this.prisma, fileId);

    return {
      file: entity.toResponseWithUrl(),
    };
  }
}
