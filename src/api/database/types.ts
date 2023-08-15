export type Query = {
  filter?: Filter | null;
};

export type Filter = LogicalFilter | FieldFilter;

export type LogicalFilter = LogicalFilterOr | LogicalFilterAnd;

export type LogicalFilterOr = {
  _or: FieldFilter[];
};

export type LogicalFilterAnd = {
  _and: FieldFilter[];
};

export type FieldFilter = {
  [field: string]: FieldFilterOperator;
};

export type FieldFilterOperator = {
  _eq?: string | number | boolean;
  _gt?: string | number | boolean;
};
