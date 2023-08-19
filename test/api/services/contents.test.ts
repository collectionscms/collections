import knex, { Knex } from 'knex';
import { describe } from 'node:test';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { ContentsService } from '../../../src/api/services/contents.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Contents', () => {
  const tableName = 'collection_f1_grand_prix_races';
  const databases = new Map<string, Knex>();

  beforeAll(async () => {
    for (const database of testDatabases) {
      const connection = knex(config.knexConfig[database]!);
      databases.set(database, connection);
      await insertRecords(connection);
    }
  });

  const insertRecords = async (connection: Knex) => {
    await connection(tableName).insert([
      {
        year: '2022',
        round: '1',
        circuit: 'Bahrain',
        updated_at: '2022-01-01 00:00:00',
      },
    ]);
  };

  afterAll(async () => {
    for (const [_, connection] of databases) {
      await connection(tableName).del();
      await connection.destroy();
    }
  });

  describe('Create', () => {
    it.each(testDatabases)('%s - should create', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const service = new ContentsService(tableName, { database: connection, schema });
      const data = await service.createOne({ year: '2023', round: '1', circuit: 'Bahrain' });

      expect(data).toBeTruthy();
    });
  });

  describe('Update', () => {
    it.each(testDatabases)('%s - should update', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const service = new ContentsService(tableName, { database: connection, schema });
      const data = await service
        .readMany({
          filter: {
            _and: [{ year: { _eq: '2022' } }, { circuit: { _eq: 'Bahrain' } }],
          },
        })
        .then((data) => data[0]);

      const result = await service.updateOne(data.id, { circuit: 'Bahrain International Circuit' });
      const updatedContent = await service.readOne(data.id);

      expect(result).toBeTruthy();
      expect(updatedContent.circuit).toBe('Bahrain International Circuit');

      const before = new Date(data.updated_at).getTime();
      const after = new Date(updatedContent.updated_at).getTime();

      expect(after).toBeGreaterThan(before);
    });

    // TODO cases without updated_at
  });
});
