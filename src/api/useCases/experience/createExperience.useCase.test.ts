import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client';
import { buildExperienceEntity } from '../../persistence/experience/experience.entity.fixture.js';
import { InMemoryExperienceRepository } from '../../persistence/experience/experience.repository.mock';
import { buildExperienceResourceEntity } from '../../persistence/experienceResource/experienceResource.entity.fixture.js';
import { InMemoryExperienceResourceRepository } from '../../persistence/experienceResource/experienceResource.repository.mock';
import { CreateExperienceUseCase } from './createExperience.useCase';

describe('CreateExperienceUseCase', () => {
  const projectId = v4();
  let createExperienceUseCase: CreateExperienceUseCase;

  const prisma = projectPrisma(projectId);
  jest.spyOn(prisma, '$transaction').mockImplementation(async (fn) => {
    return await fn(prisma);
  });

  beforeEach(() => {
    createExperienceUseCase = new CreateExperienceUseCase(
      prisma,
      new InMemoryExperienceRepository(),
      new InMemoryExperienceResourceRepository()
    );
    jest.clearAllMocks();
  });

  it('should create experiences and resources correctly', async () => {
    const props = {
      projectId: v4(),
      experiences: [
        { name: 'React', url: 'https://react.dev/', resourceUrls: ['https://example.com'] },
      ],
    };

    const result = await createExperienceUseCase.execute(props);
    expect(result).toMatchObject([
      {
        projectId: props.projectId,
        name: props.experiences[0].name,
        url: props.experiences[0].url,
        resourceUrls: props.experiences[0].resourceUrls,
      },
    ]);
  });

  it('should delete experiences that are not in the request', async () => {
    const deleteExperienceId = v4();
    jest.spyOn(InMemoryExperienceRepository.prototype, 'findManyWithResources').mockResolvedValue([
      {
        experience: buildExperienceEntity({
          id: deleteExperienceId,
        }),
        resources: [buildExperienceResourceEntity()],
      },
    ]);
    const deleteSpy = jest
      .spyOn(InMemoryExperienceRepository.prototype, 'deleteManyById')
      .mockResolvedValue();

    const props = {
      projectId: v4(),
      experiences: [
        { name: 'React', url: 'https://react.dev/', resourceUrls: ['https://example.com'] },
      ],
    };

    await createExperienceUseCase.execute(props);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should update experience that are in the request', async () => {
    const updateExperienceId = v4();
    jest.spyOn(InMemoryExperienceRepository.prototype, 'findManyWithResources').mockResolvedValue([
      {
        experience: buildExperienceEntity({
          id: updateExperienceId,
        }),
        resources: [buildExperienceResourceEntity()],
      },
    ]);
    const updateSpy = jest
      .spyOn(InMemoryExperienceRepository.prototype, 'update')
      .mockResolvedValue(buildExperienceEntity({ id: updateExperienceId }));

    const props = {
      projectId: v4(),
      experiences: [
        {
          id: updateExperienceId,
          name: 'React',
          url: 'https://react.dev/',
          resourceUrls: ['https://example.com'],
        },
      ],
    };

    await createExperienceUseCase.execute(props);
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });
});
