import knex, { Knex } from 'knex';
import { describe } from 'node:test';
import { readByQuery } from '../../../../src/api/database/operations/readByQuery.js';
import { config } from '../../../config.js';
import { testDatabases } from '../../../utilities/testDatabases.js';

describe('Read By Query', () => {
  const tableName = 'collection_f1_grand_prix_races';
  const databases = new Map<string, Knex>();
  type CollectionType = {
    year: string;
    round: string;
    circuit: string;
  };

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
        year: '2021',
        round: '1',
        circuit: 'Bahrain',
      },
      {
        year: '2022',
        round: '1',
        circuit: 'Bahrain',
      },
      {
        year: '2023',
        round: '1',
        circuit: 'Bahrain',
      },
      {
        year: '2023',
        round: '2',
        circuit: 'Saudi Arabia',
      },
    ]);
  };

  afterAll(async () => {
    for (const [_, connection] of databases) {
      await connection(tableName).del();
      await connection.destroy();
    }
  });

  describe('Get', () => {
    it.each(testDatabases)('%s - should get all records', async (database) => {
      const connection = databases.get(database)!;
      const results = await readByQuery({ database: connection, collection: tableName });

      expect(results).toHaveLength(4);
    });

    // circuit = "Bahrain"
    it.each(testDatabases)('%s - should get filtered records', async (database) => {
      const connection = databases.get(database)!;

      const results = await readByQuery<CollectionType>({
        database: connection,
        collection: tableName,
        filter: { circuit: { _eq: 'Bahrain' } },
      });
      expect(results).toHaveLength(3);
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ circuit: 'Bahrain', year: '2021' }),
          expect.objectContaining({ circuit: 'Bahrain', year: '2022' }),
          expect.objectContaining({ circuit: 'Bahrain', year: '2023' }),
        ])
      );
    });

    // circuit = "Bahrain" AND year > "2021"
    it.each(testDatabases)(
      '%s - should get records filtered by _and condition',
      async (database) => {
        const connection = databases.get(database)!;

        const results = await readByQuery<CollectionType>({
          database: connection,
          collection: tableName,
          filter: {
            _and: [{ circuit: { _eq: 'Bahrain' } }, { year: { _gt: '2021' } }],
          },
        });
        expect(results).toHaveLength(2);
        expect(results).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ circuit: 'Bahrain', year: '2022' }),
            expect.objectContaining({ circuit: 'Bahrain', year: '2023' }),
          ])
        );
      }
    );

    // circuit = "Bahrain" OR circuit = "Saudi Arabia"
    it.each(testDatabases)(
      '%s - should get records filtered by _or condition',
      async (database) => {
        const connection = databases.get(database)!;

        const results = await readByQuery<CollectionType>({
          database: connection,
          collection: tableName,
          filter: {
            _or: [{ circuit: { _eq: 'Bahrain' } }, { circuit: { _eq: 'Saudi Arabia' } }],
          },
        });
        expect(results).toHaveLength(4);
        expect(results).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ circuit: 'Bahrain', year: '2021' }),
            expect.objectContaining({ circuit: 'Bahrain', year: '2022' }),
            expect.objectContaining({ circuit: 'Bahrain', year: '2023' }),
            expect.objectContaining({ circuit: 'Saudi Arabia', year: '2023' }),
          ])
        );
      }
    );

    it.each(testDatabases)('%s - should throw invalid query', async (database) => {
      const connection = databases.get(database)!;

      const results = readByQuery<CollectionType>({
        database: connection,
        collection: tableName,
        filter: { circuit: { _eq: undefined } },
      });

      const results1 = readByQuery<CollectionType>({
        database: connection,
        collection: tableName,
        filter: { circuit: '' as any },
      });

      const results2 = readByQuery<CollectionType>({
        database: connection,
        collection: tableName,
        filter: { _and: [{ circuit: { _eq: 'Bahrain' } }, { circuit: { _eq: undefined } }] },
      });

      const results3 = readByQuery<CollectionType>({
        database: connection,
        collection: tableName,
        filter: { _or: [{ circuit: { _gt: undefined } }, { circuit: { _eq: 'Bahrain' } }] },
      });

      expect(results).rejects.toThrow();
      expect(results1).rejects.toThrow();
      expect(results2).rejects.toThrow();
      expect(results3).rejects.toThrow();
    });
  });
});
