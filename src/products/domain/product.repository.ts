export abstract class ProductRepository {
  abstract list(category: string): Promise<unknown[]>;
}
