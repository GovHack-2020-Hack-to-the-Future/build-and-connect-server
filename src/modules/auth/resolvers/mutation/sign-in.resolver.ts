import { ModuleContext } from '@graphql-modules/core';
import { AuthenticationError } from 'apollo-server-express';

import { AuthProvider } from '../../providers/auth.provider';
import { UsersProvider } from '../../../users/providers/users.provider';
import { User } from '../../../../graphql-codegen-types';

export async function signInAsync(
  obj: any,
  args: any,
  { injector }: ModuleContext
): Promise<User> {
  const currentUserInfo = await injector
    .get(AuthProvider)
    .getCurrentUserInfoAsync();

  if (!currentUserInfo) {
    throw new AuthenticationError('Failed to retrieve current user info. ');
  }

  await injector.get(UsersProvider).updateUserAsync(currentUserInfo);

  return currentUserInfo;
}
