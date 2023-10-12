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
  tableName: string;
  columnName: string;
  defaultValue: string | null;
  isNullable: boolean;
  isGenerated: boolean;
  dataType: string;
  numericPrecision?: number | null;
  numericScale?: number | null;
  maxLength: number | null;
  foreignKeyColumn: string | null;
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
          tableName: column.table,
          columnName: column.name,
          defaultValue: column.default_value,
          isNullable: column.is_nullable,
          isGenerated: column.is_generated,
          dataType: column.data_type,
          numericPrecision: column.numeric_precision,
          numericScale: column.numeric_scale,
          maxLength: column.max_length,
          foreignKeyColumn: column.foreign_key_column,
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
