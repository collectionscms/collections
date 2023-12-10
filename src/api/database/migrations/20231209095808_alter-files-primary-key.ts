import { Knex } from 'knex';

const getDistinctFileImageModels = async (knex: Knex) => {
  return await knex
    .select('*')
    .distinct('model')
    .from('CollectionsFields')
    .where('interface', '=', 'fileImage');
};

const changePrimaryKey = async (knex: Knex) => {
  await knex.schema.table('CollectionsFiles', (table) => {
    table.uuid('uuid').notNullable();
  });
  await knex('CollectionsFiles').update({ uuid: knex.raw('id') });

  await knex.schema.alterTable('CollectionsFiles', (table) => {
    table.dropColumn('id');
    table.renameColumn('uuid', 'id');
  });
};

export async function up(knex: Knex): Promise<void> {
  const fields = await getDistinctFileImageModels(knex);
  if (!fields.length) {
    return await changePrimaryKey(knex);
  }

  for (const field of fields) {
    // drop foreign key
    await knex.schema.alterTable(field.model, (table) => {
      table.dropForeign([field.field]);
      table.uuid(field.field).alter();
    });

    // change primary key data type (integer to string)
    await changePrimaryKey(knex);

    // attach foreign key
    await knex.schema.alterTable(field.model, (table) => {
      table.foreign(field.field).references('CollectionsFiles.id');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  // Do nothing
}
