import { Injectable, ProviderScope } from '@graphql-modules/di';
import { KeyValueCacheSetOptions } from 'apollo-server-caching';
import DataLoader, { BatchLoadFn } from 'dataloader';
import { Model } from 'mongoose';

import { MessageDocument, messageSchema } from '../models/message.model';
import { MongooseDataSource } from '../../data-sources/providers/mongoose-data-source.provider';

@Injectable({
  scope: ProviderScope.Session,
})
export class FeaturesProvider {
  private readonly messageByIdLoader: DataLoader<
    string,
    MessageDocument | null
  >;
  private readonly messageModel: Model<MessageDocument>;

  constructor(private mongooseDataSource: MongooseDataSource) {
    this.messageModel = this.mongooseDataSource.getModel<MessageDocument>(
      'message',
      messageSchema
    );
    this.messageByIdLoader = this.createMessageByIdLoader();
  }

  /**
   * Get message by ID.
   * @param id - Message ID.
   * @param keyValueCacheSetOptions - Key value cache set options.
   * @returns A Promise, which resolves with MessageDocument with matching ID; `null` otherwise.
   */
  async getMessageByIdAsync(
    id: string,
    keyValueCacheSetOptions?: KeyValueCacheSetOptions
  ): Promise<MessageDocument | null> {
    if (!id) {
      throw new Error('Message ID is undefined');
    }

    if (!(typeof id === 'string')) {
      throw new Error(`Invalid message ID "${id}"`);
    }

    const cacheKey = this.mongooseDataSource.getCacheKey('message', 'id', id);
    const cachedMessageDocument = await this.mongooseDataSource.getCacheAsync(
      cacheKey
    );

    if (cachedMessageDocument) {
      return JSON.parse(cachedMessageDocument);
    } else {
      const messageDocument = await this.messageByIdLoader.load(id);

      if (messageDocument && keyValueCacheSetOptions?.ttl) {
        await this.mongooseDataSource.setCacheAsync(
          cacheKey,
          JSON.stringify(messageDocument),
          keyValueCacheSetOptions
        );
      }

      return messageDocument ?? null;
    }
  }

  /**
   * Create message by ID loader.
   * @returns Message by ID loader.
   */
  private createMessageByIdLoader(): DataLoader<
    string,
    MessageDocument | null
  > {
    const batchLoadFn: BatchLoadFn<string, MessageDocument | null> = async (
      keys: readonly string[]
    ): Promise<(MessageDocument | null)[]> => {
      const messageDocuments = await this.getMessagesByIdAsync(
        keys as string[]
      );

      if (messageDocuments.length > 0) {
        const result = [];

        for (let i = 0; i < keys.length; i++) {
          const messageDocument = messageDocuments.find(
            ({ id }: MessageDocument): boolean => id === keys[i]
          );

          result.push(messageDocument ?? null);
        }

        return result;
      } else {
        return Array(keys.length).fill(null);
      }
    };

    return new DataLoader(batchLoadFn);
  }

  /**
   * Get messages by IDs.
   * @param ids - Message IDs.
   * @returns A Promise, which resolves with message documents with matching IDs.
   */
  private async getMessagesByIdAsync(
    ids: string[]
  ): Promise<MessageDocument[]> {
    return this.messageModel.find({ id: { $in: ids } });
  }
}
