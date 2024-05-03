export class PrismaBaseEntity<T> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = props;
  }

  public static Reconstruct<PrismaObjectT, EntityT = void>(
    record: PrismaObjectT
  ): NoInfer<EntityT> {
    const entity = new this({
      ...record,
    });
    return entity as EntityT;
  }

  public getPropsCopy(): T {
    const propsCopy = {
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  toResponse(): T {
    return this.getPropsCopy();
  }

  public toPersistence(): T {
    return this.getPropsCopy();
  }
}
