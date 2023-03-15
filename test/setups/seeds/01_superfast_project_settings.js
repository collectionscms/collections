exports.seed = async function (knex) {
  await knex('superfast_project_settings').del();
  return await knex('superfast_project_settings').insert([{ name: 'superfast' }]);
};
