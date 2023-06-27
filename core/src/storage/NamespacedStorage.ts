import { Storage } from "./index";

export class NamespacedStorage implements Storage {
  private store: Storage;
  private prefix: string;

  constructor(store: Storage, prefix: string) {
    this.store = store;
    this.prefix = prefix;
  }

  private prefixed(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string, defaultValue?: string): Promise<string | undefined> {
    return this.store.get(this.prefixed(key), defaultValue);
  }

  async set(key: string, value: string | undefined): Promise<void> {
    return this.store.set(this.prefixed(key), value);
  }

  async delete(key: string): Promise<void> {
    return this.store.delete(this.prefixed(key));
  }

  async exists(key: string): Promise<boolean> {
    return this.exists(this.prefixed(key));
  }
}
