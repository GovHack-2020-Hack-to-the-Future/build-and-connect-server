import { Injectable, ProviderScope } from '@graphql-modules/di';
import { Model } from 'mongoose';

import { UserDocument, userSchema } from '../models/user.model';
import { MongooseDataSource } from '../../data-sources/providers/mongoose-data-source.provider';
import { User } from '../../../graphql-codegen-types';

@Injectable({
  scope: ProviderScope.Session,
})
export class UsersProvider {
  private readonly userModel: Model<UserDocument>;

  constructor(private mongooseDataSource: MongooseDataSource) {
    this.userModel = this.mongooseDataSource.getModel<UserDocument>(
      'User',
      userSchema
    );
  }

  /**
   * Get user by ID.
   * @param id - User ID.
   * @returns A promise, which resolves with user if found; `null` otherwise.
   */
  async getUserByIdAsync(id: string): Promise<UserDocument | null> {
    if (!(typeof id === 'string')) {
      throw new Error(`Invalid user ID: ${id}`);
    }

    return this.userModel.findOne({ id });
  }

  /**
   * Update user public info.
   * @param user - User.
   */
  async updateUserAsync(user: User): Promise<void> {
    if (!user) {
      throw new Error('User info is undefined');
    }

    if (!(user.id && typeof user.id === 'string')) {
      throw new Error('Invalid User ID. ');
    }

    await this.userModel.replaceOne({ id: user.id }, user).setOptions({
      upsert: true,
    });
  }
}
