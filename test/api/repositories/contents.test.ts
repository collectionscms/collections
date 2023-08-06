import knex, { Knex } from 'knex';
import { describe } from 'node:test';
import { ContentsRepository } from '../../../src/api/repositories/contents.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Contents', () => {
  const tableName = 'collection_f1_constructors';
  const databases = new Map<string, Knex>();

  beforeAll(async () => {
    for (const database of testDatabases) {
      databases.set(database, knex(config.knexConfig[database]!));
    }
  });

  afterAll(async () => {
    for (const [_, connection] of databases) {
      await connection.destroy();
    }
  });

  describe('Create', () => {
    it.each(testDatabases)('%s - should create', async (database) => {
      const connection = databases.get(database)!;

      const repository = new ContentsRepository(tableName, { knex: connection });
      const data = await repository.create({ year: 2021, team_name: 'Mercedes' });

      expect(data).toBeTruthy();
    });
  });

  describe('Update', () => {
    it.each(testDatabases)('%s - should update', async (database) => {
      const connection = databases.get(database)!;

      const repository = new ContentsRepository(tableName, { knex: connection });
      const data = await repository.read({ year: 2022 });
      const id = data[0].id;

      const result = await repository.update(id, { team_name: 'Red Bull Racing RBPT' });
      const updatedContent = await repository.readOne(id);

      expect(result).toBeTruthy();
      expect(updatedContent.team_name).toBe('Red Bull Racing RBPT');

      const before = new Date(data[0].updated_at).getTime();
      const after = new Date(updatedContent.updated_at).getTime();

      expect(after).toBeGreaterThan(before);
    });

    // TODO cases without updated_at
  });
});
