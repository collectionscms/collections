import knex, { Knex } from 'knex';
import { SchemaOverview, getSchemaOverview } from '../../../src/api/database/overview.js';
import { ContentsService } from '../../../src/api/services/contents.js';
import { ImportDataService } from '../../../src/api/services/importData.js';
import { RecordNotUniqueException } from '../../../src/exceptions/database/recordNotUnique.js';
import { UnsupportedMediaTypeException } from '../../../src/exceptions/unsupportedMediaType.js';
import { config } from '../../config.js';
import { wordPressXml } from '../../utilities/factories.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('ImportDataService', () => {
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

  const assertExpectedData = async (
    connection: Knex,
    schema: SchemaOverview,
    model: string,
    expectData: any[]
  ) => {
    const contentsService = new ContentsService(model, {
      database: connection,
      schema,
    });
    const contents = await contentsService.readMany({});

    expect(contents).toHaveLength(expectData.length);
    expect(contents).toEqual(expect.arrayContaining(expectData));
  };

  describe('Import', () => {
    it.each(testDatabases)('%s - should throw UnsupportedMediaTypeException', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });
      const service = new ImportDataService({ database: connection, schema });

      const buffer = Buffer.from('test');
      const mimetype = 'application/json';

      await expect(service.importData(mimetype, buffer)).rejects.toThrow(
        UnsupportedMediaTypeException
      );
    });

    it.each(testDatabases)(
      '%s - should import',
      async (database) => {
        const connection = databases.get(database)!;
        let schema = await getSchemaOverview({ database: connection });

        const buffer = Buffer.from(wordPressXml);
        const mimetype = 'text/xml';

        const service = new ImportDataService({ database: connection, schema });
        await service.importData(mimetype, buffer);

        schema = await getSchemaOverview({ database: connection });

        // category
        await assertExpectedData(connection, schema, 'category', [
          expect.objectContaining({
            name: 'Uncategorized',
            slug: 'uncategorized',
          }),
          expect.objectContaining({
            name: 'blog',
            slug: 'blog',
          }),
        ]);

        // tag
        await assertExpectedData(connection, schema, 'tag', [
          expect.objectContaining({
            name: 'post',
            slug: 'post',
          }),
        ]);

        // post
        await assertExpectedData(connection, schema, 'post', [
          expect.objectContaining({
            title: 'Hello world!',
            status: 'published',
            slug: 'hello-world',
            is_page: false,
          }),
          expect.objectContaining({
            title: 'Sample Page',
            status: 'published',
            slug: 'sample-page',
            is_page: true,
          }),
          expect.objectContaining({
            title: 'Privacy Policy',
            status: 'draft',
            slug: 'privacy-policy',
            is_page: true,
          }),
        ]);
      },
      20_000
    );

    it.each(testDatabases)('%s - should throw RecordNotUniqueException', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });
      const service = new ImportDataService({ database: connection, schema });

      const buffer = Buffer.from(wordPressXml);
      const mimetype = 'text/xml';

      await expect(service.importData(mimetype, buffer)).rejects.toThrow(RecordNotUniqueException);
    });
  });
});
