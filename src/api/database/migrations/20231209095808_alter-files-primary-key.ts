import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

const getDistinctFileImageModels = async (knex: Knex) => {
  return await knex
    .select('*')
    .distinct('model')
    .from('CollectionsFields')
    .where('interface', '=', 'fileImage');
};

const changePrimaryKey = async (knex: Knex, field?: any) => {
  await knex.schema.table('CollectionsFiles', (table) => {
    table.uuid('uuid');
  });

  if (field) {
    const rows = await knex.select('*').from('CollectionsFiles');
    for (const row of rows) {
      const uuid = uuidv4();
      await knex('CollectionsFiles').update({ uuid: uuid }).where('id', '=', row.id);
      await knex(field.model)
        .update({ [`${field.field}_uuid`]: uuid })
        .where('id', '=', row.id);
    }
  }

  await knex.schema.table('CollectionsFiles', (table) => {
    table.dropColumn('id');
    table.renameColumn('uuid', 'id');
    table.setNullable('id');
    table.primary(['id']);
  });
};

export async function up(knex: Knex): Promise<void> {
  const fields = await getDistinctFileImageModels(knex);
  if (!fields.length) {
    return await changePrimaryKey(knex, []);
  }

  for (const field of fields) {
    // drop foreign key and add escape field
    await knex.schema.table(field.model, (table) => {
      table.dropForeign([field.field]);
      table.uuid(`${field.field}_uuid`);
    });

    // change primary key data type (integer to uuid)
    await changePrimaryKey(knex, field);

    // attach foreign key and drop escape field
    await knex.schema.table(field.model, (table) => {
      table.dropColumn(field.field);
      table.renameColumn(`${field.field}_uuid`, field.field);
      table.foreign(field.field).references('CollectionsFiles.id');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  // Do nothing
}
