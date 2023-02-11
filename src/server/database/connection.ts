import knex, { Knex } from 'knex';

export const getDatabase = (): Knex => {
  const config: Knex.Config = {
    client: 'sqlite3',
    connection: {
      filename: './data.db',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/server/database/migrations',
    },
    postProcessResponse: (result) => {
      if (Array.isArray(result)) {
        return result.map((row) => convertToCamel(row));
      } else {
        return convertToCamel(result);
      }
    },
  };

  return knex(config);
};

const convertToCamel = (row: any): any => {
  if (typeof row != 'object' || !row) return row;
  if (Array.isArray(row)) {
    return row.map((item) => convertToCamel(item));
  }

  const newData: any = {};
  for (let key in row) {
    let newKey = key.replace(/_([a-z])/g, (p, m) => m.toUpperCase());
    newData[newKey] = convertToCamel(row[key]);
  }
  return newData;
};
