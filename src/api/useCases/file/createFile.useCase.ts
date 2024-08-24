import { File } from '@prisma/client';
import { FileEntity } from '../../persistence/file/file.entity.js';
import { FileRepository } from '../../persistence/file/file.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';

type CreateFileUseCaseResponse = {
  files: Array<File & { url: string }>;
};

export class CreateFileUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(files: FileEntity[]): Promise<CreateFileUseCaseResponse> {
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
        return file.toResponseWithUrl();
      }),
    };
  }
}
