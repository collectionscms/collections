/* eslint-disable import/no-import-module-exports */
import async from 'async';
import { IHookAction, IHookActionFunction, IHookCache, IHookFilter } from '../interfaces/hooks';
import md5Hex from '../md5';

const hookCache: IHookCache = { actions: {}, filters: {}, syncFilters: {} };

const getQueue = <T = IHookAction | IHookFilter>(type: keyof IHookCache, key: string) => {
  if (!Array.isArray(hookCache?.[type]?.[key])) {
    hookCache[type][key] = [];
  }

  return hookCache[type][key] as unknown as T[];
};

interface HookOptions {
  priority?: number;
  id?: string;
}

const uniqueHookGuard = (queue: (IHookAction | IHookFilter)[], id: string) => {
  const exists = queue.some((hook) => hook.id === id);
  if (exists) {
    const message = `Given function id ${id}, already exists. Ensure that you aren't registering hook twice.`;
    console.error(message);

    // Module hot breaks if error is thrown in top context
    if (!module?.hot) {
      throw new Error('duplicate_hook');
    }
  }
};

const Hooks = {
  addAction: <T extends keyof Superfast.IActions | string>(
    key: T,
    action: IHookActionFunction<Superfast.IActions[T]>,
    options: Omit<HookOptions, 'priority'> = {}
  ) => {
    const id = options?.id ?? md5Hex(action.toString());

    const queue = getQueue<IHookAction>('actions', key as string);
    uniqueHookGuard(queue, id);
    queue.push({ function: action, id });
  },
  doAction: async <T extends keyof Superfast.IActions>(key: T, ...args: Superfast.IActions[T]) => {
    const queue = getQueue<IHookAction>('actions', key as string);
    await async.each(queue, async (hook, next) => {
      try {
        await hook.function(...args);
        next();
      } catch (err) {
        next(err);
      }
    });
  },
  applyFilters: async <T extends keyof Superfast.IFilters>(
    key: T,
    ...args: Superfast.IFilters[T]
  ): Promise<Superfast.IFilters[T][0]> => {
    const [first, ...rest] = args;
    const queue = getQueue<IHookFilter>('filters', key as string);
    return async.reduce(queue, first, async (memo, hook, next) => {
      try {
        const result = await hook.function(memo, ...rest);
        next(null, result);
      } catch (e) {
        next(e, memo);
      }
    }) as unknown as Promise<Superfast.IFilters[T]>;
  },
};

export default Hooks;
