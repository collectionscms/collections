import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import knex, { Knex } from 'knex';
import { describe } from 'node:test';
import { getHelpers } from '../../../src/api/database/helpers/index.js';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { ContentsService } from '../../../src/api/services/contents.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

dayjs.extend(utc);
dayjs.extend(timezone);

describe('Contents', () => {
  const tableName = 'model_f1_grand_prix_race_stats';
  const databases = new Map<string, Knex>();

  beforeAll(async () => {
    for (const database of testDatabases) {
      const connection = knex(config.knexConfig[database]!);
      databases.set(database, connection);
      await createModel(database);
    }
  });

  const createModel = async (database: string) => {
    const connection = databases.get(database)!;
    const helpers = getHelpers(connection);

    await connection('collections_models').insert([
      {
        model: tableName,
        singleton: false,
        hidden: false,
      },
    ]);

    await connection('collections_fields').insert([
      {
        model: tableName,
        field: 'id',
        label: 'id',
        interface: 'input',
      },
      {
        model: tableName,
        field: 'year',
        label: 'Year',
        interface: 'input',
      },
      {
        model: tableName,
        field: 'circuit',
        label: 'Circuit',
        interface: 'input',
      },
      {
        model: tableName,
        field: 'is_shootout',
        label: 'Shootout',
        interface: 'boolean',
      },
      {
        model: tableName,
        field: 'start_date',
        label: 'Start Date',
        interface: 'dateTime',
        special: 'cast-timestamp',
      },
    ]);

    await connection.schema.createTable(tableName, (table) => {
      table.increments();
      table.timestamps(true, true);
      table.string('year', 255);
      table.string('circuit', 255);
      table.boolean('is_shootout');
      table.timestamp('start_date');
    });

    await connection(tableName).insert([
      {
        year: '2022',
        circuit: 'Monaco',
        is_shootout: false,
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
        { year: '2023', circuit: 'Monaco', is_shootout: false },
        Object.values(schema.models[tableName].fields)
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

  describe('Get', () => {
    it.each(testDatabases)('%s - should get', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const service = new ContentsService(tableName, { database: connection, schema });
      const fetchedContent = await service
        .readMany({
          filter: {
            _and: [{ year: { _eq: '2023' } }, { circuit: { _eq: 'Monaco' } }],
          },
        })
        .then((data) => data[0]);

      const result = await service.readOne(fetchedContent.id);

      expect(result).toBeTruthy();
      expect(result).toEqual(
        expect.objectContaining({
          year: '2023',
          circuit: 'Monaco',
          is_shootout: false,
        })
      );
    });

    it.each(testDatabases)('%s - should display dateTime including time zone', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const localTime = dayjs.tz('2023-05-28T15:00:00', 'Europe/Monaco');

      const service = new ContentsService(tableName, { database: connection, schema });
      const id = await service.createContent(
        {
          year: '2023',
          circuit: 'Monaco',
          start_date: localTime,
        },
        Object.values(schema.models[tableName].fields)
      );
      const result = await service.readOne(id);
      const startDate = dayjs(result.start_date);

      expect(startDate.format('YYYY-MM-DD HH:mm')).toBe(
        localTime.local().format('YYYY-MM-DD HH:mm')
      );
      expect(startDate.tz('Europe/Monaco').format('YYYY-MM-DD HH:mm')).toBe('2023-05-28 15:00');
      expect(startDate.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm')).toBe('2023-05-28 22:00');
    });
  });
});
