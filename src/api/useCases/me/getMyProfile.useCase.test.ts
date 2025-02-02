import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client';
import { InMemoryUserRepository } from '../../persistence/user/user.repository.mock.js';
import { GetMyProfileUseCase } from './getMyProfile.useCase.js';

describe('GetMyProfileUseCase', () => {
  const projectId = v4();
  let getMyProfileUseCase: GetMyProfileUseCase;

  beforeEach(() => {
    getMyProfileUseCase = new GetMyProfileUseCase(
      projectPrisma(projectId),
      new InMemoryUserRepository()
    );
    jest.clearAllMocks();
  });

  it('should return profile data when repository returns result', async () => {
    const result = await getMyProfileUseCase.execute(v4());

    expect(result).toMatchObject({
      user: { name: 'John Doe' },
      socialProfiles: [{ provider: 'x', url: 'https://x.com/johndoe' }],
      alumni: [{ name: 'UCLA' }],
      spokenLanguages: [
        {
          language: 'English',
        },
      ],
      awards: [
        {
          name: 'Best Developer',
        },
      ],
    });
  });

  it('should throw RecordNotFoundException when repository returns null', async () => {
    jest.spyOn(InMemoryUserRepository.prototype, 'findOneByIdWithProfiles').mockResolvedValue(null);

    await expect(getMyProfileUseCase.execute(v4())).rejects.toMatchObject({
      code: 'record_not_found',
    });
  });
});
