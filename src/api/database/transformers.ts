import dayjs from 'dayjs';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { Helpers } from './helpers/index.js';
import { CollectionOverview } from './overview.js';

export type Action = 'create' | 'read' | 'update';

type Transformers = {
  [type: string]: (context: { action: Action; value: any; helpers: Helpers }) => Promise<any>;
};

const transformers: Transformers = {
  async created_at({ action, value, helpers }) {
    switch (action) {
      case 'create':
        return helpers.date.writeTimestamp(new Date().toISOString());
      case 'update':
        if (!value) return value;
        return helpers.date.writeTimestamp(new Date(value).toISOString());
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
};

const castTransformers: Transformers = {
  async 'cast-timestamp'({ action, value, helpers }) {
    if (!value) return value;

    const date = dayjs(value);
    if (!date.isValid()) {
      throw new InvalidPayloadException('invalid_date_format');
    }

    switch (action) {
      case 'create':
      case 'update':
        return helpers.date.writeTimestamp(date.toISOString());
      case 'read':
        return helpers.date.readTimestampString(date.toISOString());
      default:
        return value;
    }
  },
};

/**
 * @description Applies transformers to the given data based on the collection overview.
 * @param action
 * @param data
 * @param overview
 * @param helpers
 */
export const applyTransformers = async (
  action: Action,
  data: Record<string, any>,
  overview: CollectionOverview,
  helpers: Helpers
) => {
  // /////////////////////////////////////
  // Fields
  // /////////////////////////////////////
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

  // /////////////////////////////////////
  // Cast
  // /////////////////////////////////////
  for (const [key, value] of Object.entries(data)) {
    const special = overview.fields[key]?.special;
    if (special && special in castTransformers) {
      data[key] = await castTransformers[special]({
        action,
        value,
        helpers,
      });
    }
  }
};
