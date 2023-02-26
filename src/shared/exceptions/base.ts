export class BaseException extends Error {
  constructor(
    public status: number,
    public code: string,
    public extensions?: Record<string, any>,
    e?: string
  ) {
    super(e);
  }

  toJson() {
    return {
      status: this.status,
      code: this.code,
      extensions: this.extensions,
    };
  }
}
