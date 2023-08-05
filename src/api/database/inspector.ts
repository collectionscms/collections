import { Knex } from 'knex';
import { SchemaInspector } from 'knex-schema-inspector';

export type SchemaInfo = {
  [table: string]: {
    table: string;
    columns: {
      [column: string]: ColumnInfo;
    };
  };
};

type ColumnInfo = {
  table_name: string;
  column_name: string;
  default_value: string | null;
  is_nullable: boolean;
  is_generated: boolean;
  data_type: string;
  numeric_precision?: number | null;
  numeric_scale?: number | null;
  max_length: number | null;
};

export const getSchemaInfo = async (database: Knex): Promise<SchemaInfo> => {
  const inspector = SchemaInspector(database);

  const result: SchemaInfo = {};

  const tables = await inspector.tables();
  for (let table of tables) {
    const columns = await inspector.columnInfo(table);

    const tableColumns = columns.reduce(
      (acc, column) => {
        acc[column.name] = {
          table_name: column.table,
          column_name: column.name,
          default_value: column.default_value,
          is_nullable: column.is_nullable,
          is_generated: column.is_generated,
          data_type: column.data_type,
          numeric_precision: column.numeric_precision,
          numeric_scale: column.numeric_scale,
          max_length: column.max_length,
        };
        return acc;
      },
      {} as { [name: string]: ColumnInfo }
    );

    result[table] = {
      table: table,
      columns: tableColumns,
    };
  }

  return result;
};
