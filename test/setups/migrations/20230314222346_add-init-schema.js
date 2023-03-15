exports.up = async function (knex) {
  await knex.schema.createTable('superfast_project_settings', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('superfast_project_settings');
};
