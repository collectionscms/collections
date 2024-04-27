import { File } from '@prisma/client';
import { FileEntity } from '../../data/file/file.entity.js';
import { FileRepository } from '../../data/file/file.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { FileService } from '../../services/file.service.js';

type CreateFileUseCaseResponse = {
  file: File & { url: string };
};

export class CreateFileUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly buffer: Buffer,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(file: Omit<File, 'id'>): Promise<CreateFileUseCaseResponse> {
    const entity = FileEntity.Construct({
      ...file,
    });

    const result = await this.prisma.$transaction(async (tx) => {
      const service = new FileService(tx, this.fileRepository);
      const result = await service.upload(this.buffer, entity);
      return result;
    });

    return {
      file: {
        ...result.toResponse(),
        url: entity.url(),
      },
    };
  }
}
