export interface Storage {
  get(
    key: string,
    defaultValue: string | undefined
  ): Promise<string | undefined>;
  set(key: string, value: string | undefined): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}
