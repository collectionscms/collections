import dayjs from 'dayjs';
import knex, { Knex } from 'knex';
import { describe } from 'node:test';
import { getHelpers } from '../../../src/api/database/helpers/index.js';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { ContentsService } from '../../../src/api/services/contents.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Contents', () => {
  const tableName = 'collection_f1_grand_prix_race_stats';
  const databases = new Map<string, Knex>();

  beforeAll(async () => {
    for (const database of testDatabases) {
      const connection = knex(config.knexConfig[database]!);
      databases.set(database, connection);
      await createCollection(database);
    }
  });

  const createCollection = async (database: string) => {
    const connection = databases.get(database)!;
    const helpers = getHelpers(connection);

    await connection('superfast_collections').insert([
      {
        collection: tableName,
        singleton: false,
        hidden: false,
      },
    ]);

    await connection('superfast_fields').insert([
      {
        collection: tableName,
        field: 'id',
        label: 'id',
        interface: 'input',
      },
      {
        collection: tableName,
        field: 'year',
        label: 'Year',
        interface: 'input',
      },
      {
        collection: tableName,
        field: 'circuit',
        label: 'Circuit',
        interface: 'input',
      },
    ]);

    await connection.schema.createTable(tableName, (table) => {
      table.increments();
      table.timestamps(true, true);
      table.string('year', 255);
      table.string('circuit', 255);
    });

    await connection(tableName).insert([
      {
        year: '2022',
        circuit: 'Monaco',
        created_at: helpers.date.writeTimestamp('2022-01-01 00:00:00'),
        updated_at: helpers.date.writeTimestamp('2022-01-01 00:00:00'),
      },
    ]);
  };

  afterAll(async () => {
    for (const [_, connection] of databases) {
      await connection.destroy();
    }
  });

  describe('Create', () => {
    it.each(testDatabases)('%s - should create', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const service = new ContentsService(tableName, { database: connection, schema });

      const data = await service.createContent(
        { year: '2023', circuit: 'Monaco' },
        Object.values(schema.collections[tableName].fields)
      );

      expect(data).toBeTruthy();
    });
  });

  describe('Update', () => {
    it.each(testDatabases)('%s - should update', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const service = new ContentsService(tableName, { database: connection, schema });
      const fetchedContent = await service
        .readMany({
          filter: {
            _and: [{ year: { _eq: '2022' } }, { circuit: { _eq: 'Monaco' } }],
          },
        })
        .then((data) => data[0]);

      const result = await service.updateOne(fetchedContent.id, {
        circuit: 'Monaco in Monte Carlo',
      });
      const updatedContent = await service.readOne(fetchedContent.id);

      expect(result).toBeTruthy();
      expect(updatedContent.circuit).toBe('Monaco in Monte Carlo');

      const before = dayjs(fetchedContent.updated_at);
      const after = dayjs(updatedContent.updated_at);
      expect(after.diff(before)).toBeGreaterThan(0);
    });

    // TODO cases without updated_at
  });
});
