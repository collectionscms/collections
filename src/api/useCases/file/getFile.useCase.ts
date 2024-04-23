import { File, PrismaClient } from '@prisma/client';
import { FileRepository } from '../../data/file/file.repository.js';

type GetFileUseCaseResponse = {
  file: File & { url: string };
};

export class GetFileUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(fileId: string): Promise<GetFileUseCaseResponse> {
    const entity = await this.fileRepository.findFile(this.prisma, fileId);

    return {
      file: {
        ...entity.toResponse(),
        url: entity.url(),
      },
    };
  }
}
