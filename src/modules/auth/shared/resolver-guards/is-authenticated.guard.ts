import { ModuleContext } from '@graphql-modules/core';
import { AuthenticationError } from 'apollo-server-express';

import { AuthProvider } from '../../providers/auth.provider';

/**
 * Validate if current user is authenticated.
 */
export const isAuthenticated = () => (next: any) => async (
  root: any,
  args: any,
  context: ModuleContext,
  info: any
): Promise<any> => {
  if (!context.injector.get(AuthProvider).isAuthenticated()) {
    throw new AuthenticationError('Authentication required. ');
  }

  return next(root, args, context, info);
};
