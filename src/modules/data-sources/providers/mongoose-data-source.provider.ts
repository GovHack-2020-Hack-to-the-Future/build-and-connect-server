import { ModuleContext, OnRequest } from '@graphql-modules/core';
import { Inject, Injectable, ProviderScope } from '@graphql-modules/di';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  InMemoryLRUCache,
  KeyValueCache,
  KeyValueCacheSetOptions,
} from 'apollo-server-caching';
import { Connection, Document, Model, Schema } from 'mongoose';

@Injectable({
  scope: ProviderScope.Session,
})
export class MongooseDataSource extends DataSource implements OnRequest {
  private cache: KeyValueCache | undefined;

  constructor(@Inject('mongooseConnection') private connection: Connection) {
    super();
  }

  initialize({ cache }: DataSourceConfig<ModuleContext>): void {
    this.cache = cache || new InMemoryLRUCache();
  }

  async onRequest(): Promise<void> {
    await this.connection;
  }

  didEncounterError(error: Error): void {
    throw error;
  }

  /**
   * Get cache by key.
   * @param key - Cache key.
   * @returns A promise, which resolves with cached value if found; `undefined` otherwise.
   */
  async getCacheAsync(key: string): Promise<any | undefined> {
    return this.cache?.get(key);
  }

  /**
   * Set cache.
   * @param key - Cache key.
   * @param value - Cache value.
   * @param options - Cache options.
   */
  async setCacheAsync(
    key: string,
    value: string,
    options?: KeyValueCacheSetOptions
  ): Promise<void> {
    await this.cache?.set(key, value, options);
  }

  /**
   * Get cache key.
   * @param dataType - Data type.
   * @param key - Name of the key.
   * @param value - Value of the key.
   * @returns Cache key.
   */
  getCacheKey(dataType: string, key: string, value: string): string {
    return `${dataType}_${key}_${value}`;
  }

  /**
   * Define or retrieve a model.
   * @param name - Model name.
   * @param schema - A schema. necessary when defining a model.
   * @param collection - Name of mongodb collection (optional) if not given it will be induced from model name.
   * @returns The compiled model.
   */
  getModel<T extends Document>(
    name: string,
    schema?: Schema,
    collection?: string
  ): Model<T> {
    return this.connection.model<T>(name, schema, collection);
  }
}
