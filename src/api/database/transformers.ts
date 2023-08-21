import { Helpers } from './helpers/index.js';
import { CollectionOverview } from './overview.js';

export type Action = 'create' | 'read' | 'update';

type Transformers = {
  [type: string]: (context: { action: Action; value: any; helpers: Helpers }) => Promise<any>;
};

/**
 * @description Reset the value if the field is subject to a transform.
 * @param action
 * @param data
 * @param overview
 * @param helpers
 */
export const applyTransformersToFields = async (
  action: Action,
  data: Record<string, any>,
  overview: CollectionOverview,
  helpers: Helpers
) => {
  for (const field in overview.fields) {
    if (field in transformers) {
      const itemKey = field as keyof typeof data;
      data[itemKey] = await transformers[field]({
        action,
        value: data[itemKey],
        helpers,
      });
    }
  }
};

/**
 * @description Reset the value if the special is subject to a transform
 * @param action
 * @param data
 * @param overview
 * @param helpers
 */
export const applyTransformersToSpecialFields = async (
  action: Action,
  data: Record<string, any>,
  overview: CollectionOverview,
  helpers: Helpers
) => {
  for (const [key, value] of Object.entries(data)) {
    const special = overview.fields[key]?.special;
    if (special && special in transformers) {
      data[key] = await transformers[special]({
        action,
        value,
        helpers,
      });
    }
  }
};

export const transformers: Transformers = {
  async created_at({ action, value, helpers }) {
    switch (action) {
      case 'create':
        return helpers.date.writeTimestamp(new Date().toISOString());
      case 'read':
        return helpers.date.readTimestampString(new Date(value).toISOString());
      default:
        return value;
    }
  },
  async updated_at({ action, value, helpers }) {
    switch (action) {
      case 'create':
      case 'update':
        return helpers.date.writeTimestamp(new Date().toISOString());
      case 'read':
        return helpers.date.readTimestampString(new Date(value).toISOString());
      default:
        return value;
    }
  },
  async 'cast-timestamp'({ action, value, helpers }) {
    switch (action) {
      case 'create':
      case 'update':
        return helpers.date.writeTimestamp(new Date(value).toISOString());
      case 'read':
        return helpers.date.readTimestampString(new Date(value).toISOString());
      default:
        return value;
    }
  },
};
