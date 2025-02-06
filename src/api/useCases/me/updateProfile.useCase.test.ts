import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { bypassPrisma } from '../../database/prisma/client.js';
import { InMemoryAlumnusRepository } from '../../persistence/alumnus/alumnus.repository.mock.js';
import { InMemoryAwardRepository } from '../../persistence/award/award.repository.mock.js';
import { InMemorySocialProfileRepository } from '../../persistence/socialProfile/socialProfile.repository.mock.js';
import { InMemorySpokenLanguageRepository } from '../../persistence/spokenLanguage/spokenLanguage.repository.mock.js';
import { InMemoryUserRepository } from '../../persistence/user/user.repository.mock.js';
import { InMemoryUserExperienceRepository } from '../../persistence/userExperience/userExperience.repository.mock.js';
import { InMemoryUserProjectRepository } from '../../persistence/userProject/userProject.repository.mock.js';
import { UpdateProfileUseCase } from './updateProfile.useCase.js';

describe('UpdateProfileUseCase', () => {
  let updateProfileUseCase: UpdateProfileUseCase;

  jest.spyOn(bypassPrisma, '$transaction').mockImplementation(async (fn) => {
    return await fn(bypassPrisma);
  });

  beforeEach(() => {
    updateProfileUseCase = new UpdateProfileUseCase(
      bypassPrisma,
      new InMemoryUserRepository(),
      new InMemoryAwardRepository(),
      new InMemoryAlumnusRepository(),
      new InMemorySocialProfileRepository(),
      new InMemorySpokenLanguageRepository(),
      new InMemoryUserExperienceRepository(),
      new InMemoryUserProjectRepository()
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should update the profile and return updated data', async () => {
    const userId = v4();
    const name = faker.person.fullName();
    const employer = faker.company.name();
    const jobTitle = faker.person.jobTitle();
    const image = faker.image.url();
    const bio = faker.lorem.sentence();
    const bioUrl = faker.internet.url();

    const result = await updateProfileUseCase.execute({
      name,
      userId,
      bio,
      bioUrl,
      employer,
      jobTitle,
      image,
      xUrl: 'http://x.url',
      instagramUrl: 'http://instagram.url',
      facebookUrl: 'http://facebook.url',
      linkedInUrl: 'http://linkedin.url',
      awards: ['Best Award'],
      spokenLanguages: ['English', 'Spanish'],
      alumni: [{ name: 'University A', url: 'http://uni-a.edu' }],
      experiences: [
        { label: 'React', value: v4() },
        { label: 'SEO', value: v4() },
      ],
    });

    expect(result).toMatchObject({
      user: {
        id: userId,
        name,
        bio,
        bioUrl,
        employer,
        image,
        jobTitle,
      },
      socialProfiles: [
        { provider: 'x', url: 'http://x.url' },
        { provider: 'instagram', url: 'http://instagram.url' },
        { provider: 'facebook', url: 'http://facebook.url' },
        { provider: 'linkedIn', url: 'http://linkedin.url' },
      ],
      alumni: [{ name: 'University A' }],
      spokenLanguages: [
        {
          language: 'English',
        },
        {
          language: 'Spanish',
        },
      ],
      awards: [
        {
          name: 'Best Award',
        },
      ],
    });
  });
});
