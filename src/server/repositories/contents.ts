import { RecordNotFoundException } from '../../shared/exceptions/database/recordNotfound';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';
import CollectionsRepository from './collections';

export default class ContentsRepository extends BaseRepository<unknown> {
  appAccess: boolean;

  constructor(collection: string, appAccess: boolean, options?: AbstractRepositoryOptions) {
    super(collection, options);
    this.appAccess = appAccess;
  }

  transacting(trx: BaseTransaction): ContentsRepository {
    const repositoryTransaction = new ContentsRepository(this.collection, this.appAccess, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  async read(data: Partial<unknown> = {}): Promise<unknown[]> {
    const conditions = await this.makeConditions(data);
    return super.read(conditions);
  }

  async readOne(id: number | Partial<unknown>): Promise<unknown> {
    const conditions = await this.makeConditions({ id });

    const content = (await super.read(conditions))[0];
    if (!content) throw new RecordNotFoundException('record_not_found');

    return content;
  }

  async update(id: number, item: Partial<unknown>): Promise<boolean> {
    const conditions = await this.makeConditions({ id });

    const content = (await super.read(conditions))[0];
    if (!content) throw new RecordNotFoundException('record_not_found');

    return super.update(id, item);
  }

  async delete(id: number): Promise<boolean> {
    const conditions = await this.makeConditions({ id });

    const content = (await super.read(conditions))[0];
    if (!content) throw new RecordNotFoundException('record_not_found');

    return super.delete(id);
  }

  // Get the status field and value from the collection.
  async makeConditions(data: Partial<unknown>) {
    const collectionsRepository = new CollectionsRepository();
    const collection = (await collectionsRepository.read({ collection: this.collection }))[0];

    if (!this.appAccess && collection.statusField) {
      // For Non-application, only public data can be accessed.
      data[collection.statusField] = collection.publishValue;
    }

    return data;
  }
}
