export class BaseScanner {
  protected getOrThrow<T>(property: T | undefined) {
    if (property) {
      return property;
    }

    throw new Error("Property does not exist.");
  }
}
