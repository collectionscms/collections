import { PrismaType } from '../../database/prisma/client.js';
import { FileEntity } from './file.entity.js';

export class FileRepository {
  async findFile(prisma: PrismaType, id: string) {
    const file = await prisma.file.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return FileEntity.Reconstruct(file);
  }

  async upload(prisma: PrismaType, file: FileEntity): Promise<FileEntity> {
    const uploadedFile = await prisma.file.create({
      data: file.toPersistence(),
    });

    return FileEntity.Reconstruct(uploadedFile);
  }
}
